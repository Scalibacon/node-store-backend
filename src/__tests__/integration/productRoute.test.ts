import request from 'supertest';
import app from '../../app';
import DBConnection from '../../database/DBConnection';
import { Category } from '../../models/Category';

beforeAll(async () => {
  await DBConnection.create();
});

afterAll(async () => {
  await DBConnection.close();
});

describe('category route test', () => {
  it('should create a category', async () => {
    const category = new Category();
    category.name = "Outros";

    const result = await request(app)
      .post('/category')
      .send(category)
      .expect(201);

    expect(result.body).toEqual({id: 1, name: "Outros"});
  }); 
})