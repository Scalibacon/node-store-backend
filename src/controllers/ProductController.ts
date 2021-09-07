import { Request, Response } from 'express';
import { unlink } from 'fs/promises';
import { getCustomRepository, getRepository } from 'typeorm';
import { Picture } from '../models/Picture';
import { Product } from '../models/Product';
import ProductRepository from '../repositories/ProductRepository';

class ProductController {
  async create(request: Request, response: Response): Promise<any> {
    try {
      const product = request.body as Product;
      if(request.file)
        product.pictures = [{ imagePath: request.file.filename }]

      const repository = getCustomRepository(ProductRepository);
      const savedProduct = await repository.save(product);
  
      return response.status(201).json(savedProduct);
    } catch(err){
      if(err instanceof Error)
        console.log('Error trying to save product :>> ' + err.message);
      if(request.file)
        await unlink(`./src/public/uploads/${request.file?.filename}`);
      return response.status(500).json({ error: 'Error trying to save product' });      
    }
  };

  async update(request: Request, response: Response): Promise<any> {
    try {
      const product = request.body as Product;
      const repository = getCustomRepository(ProductRepository);
      let productToUpdate = await repository.findById(product.id);
      if(!productToUpdate){
        throw new Error('Product not found');
      }      
      const oldPicture = productToUpdate?.pictures[0];      
      productToUpdate = product;
      
      await repository.save(productToUpdate);

      // no momento atualiza geral pq só tem 1 imagem por produto
      if(request.file){
        const picRepository = getRepository(Picture);
        await picRepository.update(
          { productId: product.id }, 
          { imagePath: request.file.filename }
        );
        if(oldPicture instanceof Picture){
          await unlink(`./src/public/uploads/${oldPicture.imagePath}`);
        }
      }

      return response.json(productToUpdate);
    } catch(err){
      if(err instanceof Error)
        console.log('Error trying to update product :>> ' + err.message);
      if(request.file)
        await unlink(`./src/public/uploads/${request.file?.filename}`);
      return response.status(500).json({ error: 'Error trying to update product' });      
    }
  }

  async list(request: Request, response: Response): Promise<any> {
    try {
      const repository = getCustomRepository(ProductRepository);
      const productList = await repository.find();
      return response.json(productList);
    } catch(err){
      if(err instanceof Error)
        console.log('Error trying to get product list :>> ' + err.message);
      return response.status(500).json({ error: 'Error trying to get product list' });
    }
  };

  async findById(request: Request, response: Response): Promise<any> {
    try {
      const { id } = request.params;
      const repository = getCustomRepository(ProductRepository);
      const productFound = await repository.findById(id);
      return response.json(productFound);
    } catch (err){
      if(err instanceof Error)
        console.log('Error trying to find product by id :>> ' + err.message);
      return response.status(500).json({ error: 'Error trying to find product by id' });
    }
  };

  async filterByManyOptions(request: Request, response: Response): Promise<any> {
    try {
      const options = request.query;
      const repository = getCustomRepository(ProductRepository);
      const filteredProducts = await repository.filterByManyOptions(options);

      return response.json(filteredProducts);
    } catch(err){
      if(err instanceof Error)
        console.log('Error trying to filter products by name :>> ' + err.message);
      return response.status(500).json({ error: 'Error trying to filter products by name' });
    }
  }
}

export default new ProductController();