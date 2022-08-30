import fs from 'fs';
import path from 'path';
import request from 'supertest';
import app from '../../app';
import DBConnection from '../../database/DBConnection';
import { Category } from '../../models/Category';
import { Product } from '../../models/Product';
import { deleteUploadedPicture } from '../../utils/deletePicture';

let uploadedPostFilename: string;
let uploadedPutFilename: string;
let adminJwt: string;

beforeAll(async () => {
  await DBConnection.create();
});

afterAll(async () => {
  await DBConnection.close();

  deleteUploadedPicture(uploadedPostFilename);

  deleteUploadedPicture(uploadedPutFilename);
});

describe('get admin authorization', () => {
  it('should receive a jwt as admin', async () => {
    const result = await request(app)
      .post('/admin/login')      
      .send({ 
        email: process.env.DEFAULT_USER_EMAIL, 
        password: process.env.DEFAULT_USER_PASSWORD
      })
      .expect(201);

    expect(typeof result.body === "string").toBeTruthy();
    adminJwt = result.body;
  });
});

describe('category route test', () => {
  const category = new Category();
  category.name = "Alimentos";

  it('should create a category', async () => {
    const result = await request(app)
      .post('/category')
      .set('x-access-token', adminJwt)
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

  it('shouldn\'t create a category (duplicated)', async () => {
    const result = await request(app)
      .post('/category')
      .set('x-access-token', adminJwt)
      .send(category)
      .expect(400);

    expect(result.body).toHaveProperty('error');
  });

  it('shouldn\'t create a category (missing jwt)', async () => {    
    const result = await request(app)
      .post('/category')
      // .set('x-access-token', adminJwt)
      .send(category)
      .expect(401);

    expect(result.body).toHaveProperty('error');
  }); 

  it('shouldn\'t create a category (wrong jwt)', async () => {    
    const result = await request(app)
      .post('/category')
      .set('x-access-token', adminJwt + '.')
      .send(category)
      .expect(401);

    expect(result.body).toHaveProperty('error');
  });
});

describe('product route test', () => {
  const farofaImg = path.join(__dirname, '..', 'img', 'farofa.png');
  const newFarofaImg = path.join(__dirname, '..', 'img', 'farofa-cebola.jpg');
  const product = new Product();
  product.name = "Farofa Pronta Yoki 400g";
  product.categoryId = 1;
  product.price = 4.99;
  product.inventory = 50;
  product.description = "Hummm totoso";

  it('should create a product with image', async () => {
    const result = await request(app)
      .post('/product')
      .set('x-access-token', adminJwt)
      .field('name', product.name)
      .field('categoryId', product.categoryId)
      .field('price', product.price)
      .field('inventory', product.inventory)
      .field('description', product.description)
      .attach('pictures', farofaImg)
      .expect(201);

    uploadedPostFilename = result.body.pictures[0].imagePath;
    const imgPath = path.join(__dirname, '..', '..', 'public', 'uploads', result.body.pictures[0].imagePath);
    // const imgPath = `${__dirname}/../../public/uploads/${result.body.pictures[0].imagePath}`;
    product.id = result.body.id;
    expect(result.body.pictures[0]).toHaveProperty('imagePath');
    expect(result.body.name).toBe(product.name);
    expect(result.body.id).toBeTruthy();
    expect(fs.existsSync(imgPath)).toBeTruthy();
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
      .put(`/product/${product.id}`)
      .set('x-access-token', adminJwt)
      .field('name', product.name)
      .field('categoryId', product.categoryId)
      .field('price', product.price)
      .field('inventory', product.inventory)
      .field('description', product.description)
      .attach('pictures', newFarofaImg)
      .expect(200);

    uploadedPutFilename = result.body.pictures[0].imagePath;     

    const oldImgPath = path.join(__dirname, '..', '..', 'public', 'uploads', uploadedPostFilename);
    const imgPath = path.join(__dirname, '..', '..', 'public', 'uploads', result.body.pictures[0].imagePath);
    expect(result.body.pictures[0]).toHaveProperty('imagePath');
    expect(result.body.name).toBe(product.name);
    expect(result.body.description).toBe(product.description);
    expect(result.body.price).toBe(product.price);
    expect(result.body.inventory).toBe(product.inventory);
    expect(fs.existsSync(imgPath)).toBeTruthy();
    expect(fs.existsSync(oldImgPath)).toBeFalsy();
  });

  it('should update a product without image', async () => {
    const result = await request(app)
      .put(`/product/${product.id}`)
      .set('x-access-token', adminJwt)
      .field('name', product.name)
      .field('categoryId', product.categoryId)
      .field('price', product.price)
      .field('inventory', product.inventory)
      .field('description', product.description)
      // .attach('pictures', newFarofaImg)
      .expect(200);

    expect(result.body.name).toBe(product.name);
  });

  it('shouldn\'t create a product (missing name)', async () => {
    const result = await request(app)
      .post('/product')
      .set('x-access-token', adminJwt)
      // .field('name', product.name)
      .field('categoryId', product.categoryId)
      .field('price', product.price)
      .field('inventory', product.inventory)
      .field('description', product.description)
      .attach('pictures', farofaImg)
      .expect(400);

    expect(result.body).toHaveProperty("error");
  });

  it('shouldn\'t create a product (missing price)', async () => {
    const result = await request(app)
      .post('/product')
      .set('x-access-token', adminJwt)
      .field('name', product.name)
      .field('categoryId', product.categoryId)
      // .field('price', product.price)
      .field('inventory', product.inventory)
      .field('description', product.description)
      .attach('pictures', farofaImg)
      .expect(400);

    expect(result.body).toHaveProperty("error");
  });

  it('shouldn\'t create a product (wrong category)', async () => {
    const result = await request(app)
      .post('/product')
      .set('x-access-token', adminJwt)
      .field('name', product.name)
      .field('categoryId', 5)
      .field('price', product.price)
      .field('inventory', product.inventory)
      .field('description', product.description)
      .attach('pictures', farofaImg)
      .expect(500);

    expect(result.body).toHaveProperty("error");
  });

  it('shouldn\'t create a product (missing jwt)', async () => {
    const result = await request(app)
      .post('/product')
      // .set('x-access-token', adminJwt)
      .field('name', product.name)
      .field('categoryId', 5)
      .field('price', product.price)
      .field('inventory', product.inventory)
      .field('description', product.description)
      .attach('pictures', farofaImg)
      .expect(401);

    expect(result.body).toHaveProperty("error");
  });

  it('shouldn\'t create a product (wrong jwt)', async () => {
    const result = await request(app)
      .post('/product')
      .set('x-access-token', adminJwt + 'aaa')
      .field('name', product.name)
      .field('categoryId', 5)
      .field('price', product.price)
      .field('inventory', product.inventory)
      .field('description', product.description)
      .attach('pictures', farofaImg)
      .expect(401);

    expect(result.body).toHaveProperty("error");
  });

  it('shouldn\'t update a product (missing jwt)', async () => {
    product.name = "Farofa com cebola";
    const result = await request(app)
      .put(`/product/${product.id}`)
      // .set('x-access-token', adminJwt)
      .field('name', product.name)
      .field('categoryId', product.categoryId)
      .field('price', product.price)
      .field('inventory', product.inventory)
      .field('description', product.description)
      .attach('pictures', newFarofaImg)
      .expect(401);

    expect(result.body).toHaveProperty("error");
  });

  it('should delete a product', async () => {
    const result = await request(app)
      .delete(`/product/${product.id}`)
      .set('x-access-token', adminJwt)
      .expect(200);

    const imgPath = path.join(__dirname, '..', '..', 'public', 'uploads', uploadedPutFilename);

    expect(result.body).toBe(true);    
    expect(fs.existsSync(imgPath)).toBeFalsy();
  });

  it('shouldn\'t delete a product (missing jwt)', async () => {
    const result = await request(app)
      .delete(`/product/${product.id}`)
      // .set('x-access-token', adminJwt)
      .expect(401);

    expect(result.body).toHaveProperty('error');  
  });
});