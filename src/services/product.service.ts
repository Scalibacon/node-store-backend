import DBConnection from "../database/DBConnection";
import fs from 'fs';
import { deleteUploadedPicture } from "../utils/deletePicture";
import { Product } from "../models/Product";
import ProductRepository, { ProductOptions } from "../repositories/ProductRepository";
import ErrorMessage from "../utils/ErrorMessage";
import { Picture } from "../models/Picture";

// trazer as operações da controller pra cá
class ProductService{
  async create(product: Product): Promise<Product | ErrorMessage>{
    try{
      const repository = DBConnection.connection.getCustomRepository(ProductRepository);
      const savedProduct = await repository.save(product);

      return savedProduct;
    } catch(err){
      if(err instanceof Error)
        console.log('Error trying to create product =>> ' + err.message);
        deleteUploadedPicture(product.pictures.map(pic => pic.imagePath));
      return new ErrorMessage('Error trying to create product'); 
    }
  }

  async update(product: Product, pictures: Picture[] = []): Promise<Product | ErrorMessage>{
    try{      
      const repository = DBConnection.connection.getCustomRepository(ProductRepository);
      let productToUpdate = await repository.findById(product.id);
      if(!productToUpdate)
        throw new Error('Product not found');        
      
      const oldPicture = productToUpdate?.pictures[0];      
      productToUpdate = product;
      
      await repository.save(productToUpdate);
      if(pictures.length > 0){
        const picRepository = DBConnection.connection.getRepository(Picture);            
        if(oldPicture) {
          // atualiza todas porque só tem 1 por produto no momento    
          await picRepository.update(
            { productId: pictures[0].productId }, 
            { imagePath: pictures[0].imagePath }
          );
          deleteUploadedPicture(oldPicture.imagePath);
        } else {
          await picRepository.save(pictures[0]);
        }
      }
      productToUpdate.pictures = pictures;

      return productToUpdate;
    } catch(err){
      deleteUploadedPicture(pictures.map(pic => pic.imagePath));
      if(err instanceof Error){
        console.log('Error trying to create product =>> ' + err.message);
        if(err.message === "Product not found")
          return new ErrorMessage('Product not found', 400);
      }
      return new ErrorMessage('Error trying to update product'); 
    }
  }  

  async findById(id: string): Promise<Product | undefined | ErrorMessage>{
    try{
      const repository = DBConnection.connection.getCustomRepository(ProductRepository);
      const productFound = await repository.findById(id);
      return productFound;
    } catch(err){
      if(err instanceof Error)
        console.log('Error trying to find product by id =>> ' + err.message);
      return new ErrorMessage('Error trying to find product by id'); 
    }    
  }

  async filterByManyOptions(options: ProductOptions): Promise<Product[] | undefined | ErrorMessage>{
    try {
      const repository = DBConnection.connection.getCustomRepository(ProductRepository);
      const filteredProducts = await repository.filterByManyOptions(options);

      return filteredProducts;
    } catch(err){
      if(err instanceof Error)
        console.log('Error trying to filter products =>> ' + err.message);
      return new ErrorMessage('Error trying to filter products');
    }
  }

  async delete(productId: string): Promise<boolean | ErrorMessage>{
    try {
      const repository = DBConnection.connection.getRepository(Product);    

      const product = await repository.findOne(productId);
      if(!product)
        throw new Error('Product doesn\'t exists');
      await repository.delete(productId);
      product.pictures.forEach(async picture => {
        await deleteUploadedPicture(picture.imagePath);
      });

      return true;
    } catch(err){
      if(err instanceof Error)
        console.log('Error trying to delete product =>> ' + err.message);
      return new ErrorMessage('Error trying to delete product');
    }
  }
}

export default new ProductService();