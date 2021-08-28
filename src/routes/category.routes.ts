import { Router } from "express";
import { getRepository } from "typeorm";
import { Category } from "../models/Category";

const categoryRouter = Router();

categoryRouter.post('/', async (request, response) => {
  try {
    const category = request.body;
    const repository = getRepository(Category);
    const savedCategory = await repository.save(category);
    
    return response.status(201).json(savedCategory);
  } catch(err){
    console.log('Error trying to create category :>> ' + err.message);
    return response.status(500).json({ error: 'Error trying to create category' });
  }
});

categoryRouter.get('/', async (request, response) => {
  try{
    const repository = getRepository(Category);
    const categoryList = await repository.find();
    return response.status(200).json(categoryList);
  } catch(err){
    console.log('Error trying to get category list :>> ' + err.message);
    return response.status(500).json({ error: 'Error trying to getcategory list' });
  }
});

export default categoryRouter;