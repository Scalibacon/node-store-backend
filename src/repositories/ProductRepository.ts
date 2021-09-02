import { Between, Brackets, EntityRepository, Repository } from "typeorm";
import { Product } from "../models/Product";

type Options = {
  name?: string,
  categoryId?: number,
  minPrice?: number,
  maxPrice?: number
}

@EntityRepository(Product)
export default class ProductRepository extends Repository<Product>{
  public async findById(id: string): Promise<Product|undefined>{
    const product = await this.findOne({
      where: { id: id }
    });

    return product;
  }

  public async filterByCategory(categoryId: number): Promise<Product[]>{
    const filteredProducts = await this.find({
      where: { 
        category: {
          id: categoryId
        }
      }
    });

    return filteredProducts;
  }

  public async filterByManyOptions({ name, categoryId, minPrice, maxPrice }: Options): Promise<Product[]>{
    const query = this.createQueryBuilder('product');

    if(name){
      query.where( new Brackets(qb => {
        qb.where('product.name LIKE :nameProd', { nameProd: `%${name}%` })
          .orWhere('product.description LIKE :nameDesc', { nameDesc: `%${name}%` }) 
      })); 
    }
    
    if(categoryId){
      query.andWhere('product.category_id = :categoryId', { categoryId })
    }

    if(minPrice){
      query.andWhere('product.price >= :minPrice', { minPrice })
    }

    if(maxPrice){
      query.andWhere('product.price <= :maxPrice', { maxPrice })
    }

    const filteredProducts = await query.getMany();

    return filteredProducts;
  }
}