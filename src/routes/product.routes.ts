import { Router } from 'express';
import { getRepository } from 'typeorm';
import { Product } from '../models/Product';

const productRouter = Router();

productRouter.post('/', async (request, response) => {
  try {
    const repository = getRepository(Product);
  } catch(err){
    console.log('Error trying to save product :>> ' + err.message);
  }  
})

export default productRouter;