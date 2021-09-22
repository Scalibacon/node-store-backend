import { Request, Response } from 'express';
import { Picture } from '../models/Picture';
import { Product } from '../models/Product';
import productService from '../services/product.service';
import ErrorMessage from '../utils/ErrorMessage';
import { isCelebrateError } from 'celebrate';

class ProductController {
  async create(request: Request, response: Response): Promise<any> {
    const product = request.body as Product;
    //no momento só 1 imagem por produto
    if(request.files instanceof Array && request.files.length > 0)        
      product.pictures = [{ imagePath: request.files[0].filename }] 
            
    const savedProduct = await productService.create(product); 

    return response.status(savedProduct instanceof ErrorMessage ? savedProduct.status : 201).json(savedProduct);    
  };

  async update(request: Request, response: Response): Promise<any> {  
    const product = request.body as Product;
    product.id = request.params.id;
    let pictures;
    if(request.files instanceof Array && request.files.length > 0)        
      pictures = [{ productId: product.id, imagePath: request.files[0].filename }];
      
    const updatedProduct = await productService.update(product, pictures); 

    return response.status(updatedProduct instanceof ErrorMessage ? updatedProduct.status : 200).json(updatedProduct);   
  }  

  async findById(request: Request, response: Response): Promise<any> {
    const { id } = request.params;
    const productFound = await productService.findById(id);

    return response.status(productFound instanceof ErrorMessage ? productFound.status : 200).json(productFound);
  };

  async filterByManyOptions(request: Request, response: Response): Promise<any> {    
    const options = request.query;
    const filteredProducts = await productService.filterByManyOptions(options);
    return response.status(filteredProducts instanceof ErrorMessage ? filteredProducts.status : 200).json(filteredProducts);
  }
     
  async deletePictureOnError(error: Error, request: Request, response: Response, next: Function){
    if(!isCelebrateError(error)) 
      return next(error);
    
    if(request.files instanceof Array && request.files.length > 0){
      const picture = { imagePath: request.files[0].filename } as Picture;
      productService.deletePicture(picture);
    }

    return next(error);
  }
}

export default new ProductController();