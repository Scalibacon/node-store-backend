import fs from 'fs';
import request from 'supertest';
import app from '../../app';
import DBConnection from '../../database/DBConnection';
import { Category } from '../../models/Category';
import { Product } from '../../models/Product';

let uploadedPostImagePath: string;
let uploadedPutImagePath: string;

beforeAll(async () => {
  await DBConnection.create();
});

afterAll(async () => {
  await DBConnection.close();

  if(fs.existsSync(uploadedPostImagePath)){
    await fs.promises.unlink(uploadedPostImagePath);
  }

  if(fs.existsSync(uploadedPutImagePath)){
    await fs.promises.unlink(uploadedPutImagePath);
  }
});

describe('category route test', () => {
  it('should create a category', async () => {
    const category = new Category();
    category.name = "Alimentos";

    const result = await request(app)
      .post('/category')
      .send(category)
      .expect(201);

    expect(result.body).toEqual({id: 1, name: "Alimentos"});
  }); 

  it('should list categories', async () => {
    const result = await request(app)
      .get('/category')
      .expect(200);

    expect(result.body[0]).toEqual({id: 1, name: "Alimentos"});
  });
});


describe('product route test', () => {
  const farofaImg = `${__dirname}/../img/farofa.png`;
  const newFarofaImg = `${__dirname}/../img/farofa-cebola.jpg`;
  const product = new Product();
  product.name = "Farofa Pronta Yoki 400g";
  product.categoryId = 1;
  product.price = 4.99;
  product.inventory = 50;
  product.description = "Hummm totoso";

  it('should create a product with image', async () => {
    const result = await request(app)
      .post('/product')
      .field('name', product.name)
      .field('categoryId', product.categoryId)
      .field('price', product.price)
      .field('inventory', product.inventory)
      .field('description', product.description)
      .attach('pictures', farofaImg)
      .expect(201);

    uploadedPostImagePath = `${__dirname}/../../public/uploads/${result.body.pictures[0].imagePath}`;
    product.id = result.body.id;
    expect(result.body.pictures[0]).toHaveProperty('imagePath');
    expect(result.body.name).toBe(product.name);
    expect(result.body.id).toBeTruthy();
    expect(fs.existsSync(uploadedPostImagePath)).toBeTruthy();
  });

  it('should list all products with no filters', async () => {
    const result = await request(app)
      .get('/product')
      .expect(200);

    expect(result.body[0].name).toBe(product.name);
    expect(result.body[0].pictures[0]).toHaveProperty('imagePath');
    expect(result.body[0].category.id).toBe(product.categoryId);
  });

  it('should list a product with all filters', async () => {
    const result = await request(app)
      .get('/product?name=Yoki&categoryId=1&minPrice=4&maxPrice=10')
      .expect(200);

    expect(result.body[0].name).toBe(product.name);
    expect(result.body[0].pictures[0]).toHaveProperty('imagePath');
  });

  it('should list no product with all filters (distinct category)', async () => {
    const result = await request(app)
      .get('/product?name=Yoki&categoryId=5&minPrice=4&maxPrice=10')
      .expect(200);

    expect(result.body.length).toBe(0);
  });

  it('should list no product with all filters (distinct name)', async () => {
    const result = await request(app)
      .get('/product?name=Panetone&categoryId=1&minPrice=4&maxPrice=10')
      .expect(200);

    expect(result.body.length).toBe(0);
  });

  it('should list no product with all filters (distinct minPrice)', async () => {
    const result = await request(app)
      .get('/product?name=Faro&categoryId=1&minPrice=8&maxPrice=10')
      .expect(200);

    expect(result.body.length).toBe(0);
  });

  it('should list no product with all filters (distinct maxPrice)', async () => {
    const result = await request(app)
      .get('/product?name=Pronta&categoryId=1&minPrice=1&maxPrice=2')
      .expect(200);

    expect(result.body.length).toBe(0);
  });

  it('should update a product with image', async () => {
    product.name = "Farofa com cebola";
    product.description = "Uma farofa pronta com cebola";
    product.price = 10;
    product.inventory = 70;
    const result = await request(app)
      .put(`/product`)
      .field('id', product.id)
      .field('name', product.name)
      .field('categoryId', product.categoryId)
      .field('price', product.price)
      .field('inventory', product.inventory)
      .field('description', product.description)
      .attach('pictures', newFarofaImg)
      .expect(200);

    uploadedPutImagePath = `${__dirname}/../../public/uploads/${result.body.pictures[0].imagePath}`;
    expect(result.body.pictures[0]).toHaveProperty('imagePath');
    expect(result.body.name).toBe(product.name);
    expect(result.body.description).toBe(product.description);
    expect(result.body.price).toBe(product.price);
    expect(result.body.inventory).toBe(product.inventory);
    expect(fs.existsSync(uploadedPutImagePath)).toBeTruthy();
    expect(fs.existsSync(uploadedPostImagePath)).toBeFalsy();
  });
});