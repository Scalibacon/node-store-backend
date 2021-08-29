import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import ProductRepository from '../repositories/ProductRepository';

class ProductController {
  async create(request: Request, response: Response): Promise<any> {
    try {
      const product = request.body;
      const repository = getCustomRepository(ProductRepository);
      const savedProduct = await repository.save(product);
  
      return response.status(201).json(savedProduct);
    } catch(err){
      console.log('Error trying to save product :>> ' + err.message);
      return response.status(500).json({ error: 'Error trying to save product' });
    }
  };

  async list(request: Request, response: Response): Promise<any> {
    try {
      const repository = getCustomRepository(ProductRepository);
      const productList = await repository.find();
      return response.json(productList);
    } catch(err){
      console.log('Error trying to get product list :>> ' + err.message);
      return response.status(500).json({ error: 'Error trying to get product list' });
    }
  };

  async filterByName(request: Request, response: Response): Promise<any> {
    try {
      const { name } = request.params;
      const repository = getCustomRepository(ProductRepository);
      const filteredProductList = await repository.findByName(name);
      return response.status(200).json(filteredProductList);
    } catch (err){
      console.log('Error trying to get filtred product :>> ' + err.message);
      return response.status(500).json({ error: 'Error trying to get filtred product' });
    }
  };
}

export default new ProductController();