import { Router } from "express";
import { getRepository } from "typeorm";
import { Category } from "../models/Category";

const categoryRouter = Router();

categoryRouter.post('/', async (request, response) => {
  try {
    const category = request.body;
    const repository = getRepository(Category);
    const result = await repository.save(category);
    
    return response.status(201).json(result);
  } catch(err){
    console.log('Error trying to create category :>> ' + err.message);
  }
});

export default categoryRouter;