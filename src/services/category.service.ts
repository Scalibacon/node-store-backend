import DBConnection from "../database/DBConnection";
import ErrorMessage from "../utils/ErrorMessage";
import { Category } from "../models/Category";

class CategoryServices {
  async create(category: Category): Promise<Category | ErrorMessage> {
    try {
      const repository = DBConnection.connection.getRepository(Category);
      const savedCategory = await repository.save(category);
      return savedCategory;
    } catch(err){
      if(err instanceof Error)
        console.log('Error trying to create category :>> ' + err.message);
      return new ErrorMessage('Category already exists');      
    }
  }

  async list(): Promise<Category[] | ErrorMessage>{
    try{
      const repository = DBConnection.connection.getRepository(Category);
      const categoryList = await repository.find();
      return categoryList;
    } catch(err){
      if(err instanceof Error)
        console.log('Error trying to get category list :>> ' + err.message);
      return new ErrorMessage('Error trying to get category list');      
    }
  }
}

export default new CategoryServices();