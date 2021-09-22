import { Request, Response } from 'express';
import { Category } from "../models/Category";
import categoryService from '../services/category.service';
import ErrorMessage from '../utils/ErrorMessage';

class CategoryController {
  async create(request: Request, response: Response): Promise<any>{
    const category = request.body as Category;
    const savedCategory = await categoryService.create(category); 
          
    return response.status(savedCategory instanceof ErrorMessage ? savedCategory.status : 201).json(savedCategory);    
  };

  async list(request: Request, response: Response): Promise<any>{
    const categoryList = await categoryService.list();
          
    return response.status(categoryList instanceof ErrorMessage ? categoryList.status : 200).json(categoryList); 
  };
}

export default new CategoryController();