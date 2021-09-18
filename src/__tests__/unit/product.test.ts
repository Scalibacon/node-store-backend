import { Category } from "../../models/Category";
import DBConnection from '../../database/DBConnection';
import { Product } from "../../models/Product";
import categoryService from "../../services/category.service";
import productService from "../../services/product.service";

beforeAll(async () => {
  await DBConnection.create();
});

afterAll(async () => {
  await DBConnection.close();
});

describe('testing category crud', () => {
  it('should create a category', async () => {
    const category = new Category();    
    category.name = "Outros";
    const result = await categoryService.create(category);
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
    const savedProduct = await productService.create(product) as Product;
    expect(savedProduct).toBeInstanceOf(Product);
    product.id = savedProduct.id;
    expect(savedProduct.name).toBe(product.name);    
  });

  it('should update a product', async () => {
    product.description = "Uma descrição demasiada séria 😎";
    const savedProduct = await productService.update(product) as Product;
    expect(savedProduct).toBeInstanceOf(Product);
    expect(savedProduct.description).toBe(product.description);
  });

  it('should get a product by id', async () => {
    const productFound = await productService.findById(product.id) as Product;
    expect(productFound).toBeInstanceOf(Product);
    expect(productFound?.name).toBe(product.name);
    expect(productFound?.category.name).toBe('Outros');
    expect(productFound?.description).toBe(product.description);
    expect(productFound?.inventory).toBe(product.inventory);
    expect(productFound?.price).toBeCloseTo(product.price);
  });

  it('should list a product with no filters', async () => {
    const productList = await productService.filterByManyOptions({}) as Product[];
    expect(Array.isArray(productList)).toBeTruthy();
    expect(productList[0].name).toBe(product.name);
  });

  it('should list a product with all filters', async () => {
    const productList = await productService.filterByManyOptions({
      name: 'Chu', maxPrice: 50, minPrice: 1, categoryId: 1
    }) as Product[];

    expect(Array.isArray(productList)).toBeTruthy();
    expect(productList[0].name).toBe(product.name);
  });

  it('should list no product with all filters (distinct category)', async () => {
    const productList = await productService.filterByManyOptions({
      name: 'Chu', maxPrice: 50, minPrice: 1, categoryId: 2
    }) as Product[];

    expect(Array.isArray(productList)).toBeTruthy();
    expect(productList.length).toBe(0);
  });

  it('should list no product with all filters (distinct name/desc)', async () => {
    const productList = await productService.filterByManyOptions({
      name: 'Uhc', maxPrice: 50, minPrice: 1, categoryId: 1
    }) as Product[];

    expect(Array.isArray(productList)).toBeTruthy();
    expect(productList.length).toBe(0);
  });

  it('should list no product with all filters (distinct maxPrice)', async () => {
    const productList = await productService.filterByManyOptions({
      name: 'Chu', maxPrice: 1.50, minPrice: 1, categoryId: 1
    }) as Product[];

    expect(Array.isArray(productList)).toBeTruthy();
    expect(productList.length).toBe(0);
  });

  it('should list no product with all filters (distinct minPrice)', async () => {
    const productList = await productService.filterByManyOptions({
      name: 'Chu', maxPrice: 50, minPrice: 2, categoryId: 1
    }) as Product[];

    expect(Array.isArray(productList)).toBeTruthy();
    expect(productList.length).toBe(0);
  }); 
});