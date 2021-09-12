import { Connection, getCustomRepository } from "typeorm";
import { Category } from "../../models/Category";
import connection from '../../database/connection';
import { Product } from "../../models/Product";
import ProductRepository from "../../repositories/ProductRepository";

let conn: Connection;

beforeAll(async () => {
  conn = await connection.create('test');
});

afterAll(async () => {
  await conn.close();
})

describe('testing category crud', () => {
  test('should create category properly', async () => {
    const repository = conn.getRepository(Category);
    const category = new Category();
    category.name = "Outros";
    const result = await repository.save(category);
    expect(result).toEqual(category);
  });

  test('should list 1 category', async () => {
    const repository = conn.getRepository(Category);
    const list = await repository.find();
    expect(list[0]).toEqual({id: 1, name: 'Outros'})
  });
});

describe('testing product crud', () => {
  let productId: string;
  test('should create product properly', async () => {
    const product = new Product();
    product.name = "Chup-chup";
    product.categoryId = 1;
    product.description = "Testezada de levs";
    product.inventory = 5;
    product.price = 1.99;

    const repository = conn.getCustomRepository(ProductRepository);
    const savedProduct = await repository.save(product);
    productId = savedProduct.id;
    expect(savedProduct.name).toBe('Chup-chup');
  });

  test('should get product by id', async () => {
    const repository = conn.getCustomRepository(ProductRepository);
    const productFound = await repository.findById(productId);
    expect(productFound?.name).toBe('Chup-chup');
  })

  test('should list products with no filters', async () => {
    const repository = conn.getCustomRepository(ProductRepository);
    const productList = await repository.filterByManyOptions({});
    expect(productList[0].name).toBe('Chup-chup');
  });
})