import { Category } from "../../models/Category";
import DBConnection from '../../database/DBConnection';
import { Product } from "../../models/Product";
import ProductRepository from "../../repositories/ProductRepository";

beforeAll(async () => {
  await DBConnection.create();
});

afterAll(async () => {
  await DBConnection.close();
});

describe('testing category crud', () => {
  it('should create a category', async () => {
    const repository = DBConnection.connection.getRepository(Category);
    const category = new Category();
    category.name = "Outros";
    const result = await repository.save(category);
    expect(result).toEqual(category);
  });

  it('should list 1 category', async () => {
    const repository = DBConnection.connection.getRepository(Category);
    const list = await repository.find();
    expect(list[0]).toEqual({id: 1, name: 'Outros'})
  });
});



describe('testing product crud', () => {
  const product = new Product();
  product.name = "Chup-chup";
  product.categoryId = 1;
  product.description = "Testezada de levs";
  product.inventory = 5;
  product.price = 1.99;

  it('should create a product', async () => {
    const repository = DBConnection.connection.getCustomRepository(ProductRepository);
    const savedProduct = await repository.save(product);
    product.id = savedProduct.id;
    expect(savedProduct.name).toBe(product.name);
  });

  it('should update a product', async () => {
    product.description = "Uma descrição demasiada séria 😎";
    const repository = DBConnection.connection.getCustomRepository(ProductRepository);
    const savedProduct = await repository.save(product);
    expect(savedProduct.description).toBe(product.description);
  });

  it('should get a product by id', async () => {
    const repository = DBConnection.connection.getCustomRepository(ProductRepository);
    const productFound = await repository.findById(product.id);
    expect(productFound?.name).toBe('Chup-chup');
    expect(productFound?.category.name).toBe('Outros');
    expect(productFound?.description).toBe(product.description);
    expect(productFound?.inventory).toBe(product.inventory);
    expect(productFound?.price).toBeCloseTo(product.price);
  });

  it('should list a product with no filters', async () => {
    const repository = DBConnection.connection.getCustomRepository(ProductRepository);
    const productList = await repository.filterByManyOptions({});
    expect(productList[0].name).toBe(product.name);
  });

  it('should list a product with all filters', async () => {
    const repository = DBConnection.connection.getCustomRepository(ProductRepository);
    const productList = await repository.filterByManyOptions({
      name: 'Chu', maxPrice: 50, minPrice: 1, categoryId: 1
    });
    expect(productList[0].name).toBe(product.name);
  });

  it('should list no product with all filters (distinct category)', async () => {
    const repository = DBConnection.connection.getCustomRepository(ProductRepository);
    const productList = await repository.filterByManyOptions({
      name: 'Chu', maxPrice: 50, minPrice: 1, categoryId: 2
    });
    expect(productList.length).toBe(0);
  });

  it('should list no product with all filters (distinct name/desc)', async () => {
    const repository = DBConnection.connection.getCustomRepository(ProductRepository);
    const productList = await repository.filterByManyOptions({
      name: 'Uhc', maxPrice: 50, minPrice: 1, categoryId: 1
    });
    expect(productList.length).toBe(0);
  });

  it('should list no product with all filters (distinct maxPrice)', async () => {
    const repository = DBConnection.connection.getCustomRepository(ProductRepository);
    const productList = await repository.filterByManyOptions({
      name: 'Chu', maxPrice: 1.50, minPrice: 1, categoryId: 1
    });
    expect(productList.length).toBe(0);
  });

  it('should list no product with all filters (distinct minPrice)', async () => {
    const repository = DBConnection.connection.getCustomRepository(ProductRepository);
    const productList = await repository.filterByManyOptions({
      name: 'Chu', maxPrice: 50, minPrice: 2, categoryId: 1
    });
    expect(productList.length).toBe(0);
  }); 
});