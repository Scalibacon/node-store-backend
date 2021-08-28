import { request, response, Router } from 'express';
import { getCustomRepository, getRepository } from 'typeorm';
import { Product } from '../models/Product';
import ProductRepository from '../repositories/ProductRepository';

const productRouter = Router();

productRouter.post('/', async (request, response) => {
  try {
    const product = request.body;
    const repository = getCustomRepository(ProductRepository);
    const savedProduct = await repository.save(product);

    return response.status(201).json(savedProduct);
  } catch(err){
    console.log('Error trying to save product :>> ' + err.message);
    return response.status(500).json({ error: 'Error trying to save product' });
  }  
})

productRouter.get('/', async (request, response) => {
  try {
    const repository = getCustomRepository(ProductRepository);
    const productList = await repository.find();
    return response.json(productList);
  } catch(err){
    console.log('Error trying to get product list :>> ' + err.message);
    return response.status(500).json({ error: 'Error trying to get product list' });
  }
});

productRouter.get('/:name', async (request, response) => {
  try {
    const { name } = request.params;
    const repository = getCustomRepository(ProductRepository);
    const filteredProductList = await repository.findByName(name);
    return response.status(200).json(filteredProductList);
  } catch (err){
    console.log('Error trying to get filtred product :>> ' + err.message);
    return response.status(500).json({ error: 'Error trying to get filtred product' });
  }
})

export default productRouter;