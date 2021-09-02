import { Request, Response } from 'express';
import { getRepository } from "typeorm";
import { Category } from "../models/Category";

class CategoryController {
  async create(request: Request, response: Response): Promise<any>{
    try {
      const category = request.body;
      const repository = getRepository(Category);
      const savedCategory = await repository.save(category);
      
      return response.status(201).json(savedCategory);
    } catch(err){
      if(err instanceof Error)
        console.log('Error trying to create category :>> ' + err.message);
      return response.status(500).json({ error: 'Error trying to create category' });      
    }
  };

  async list(request: Request, response: Response): Promise<any>{
    try{
      const repository = getRepository(Category);
      const categoryList = await repository.find();
      return response.status(200).json(categoryList);
    } catch(err){
      if(err instanceof Error)
        console.log('Error trying to get category list :>> ' + err.message);
      return response.status(500).json({ error: 'Error trying to getcategory list' });      
    }
  };
}

export default new CategoryController();