import { Between, EntityRepository, Like, Not, Repository } from "typeorm";
import { Product } from "../models/Product";

export type ProductOptions = {
  name?: string,
  categoryId?: number,
  minPrice?: number,
  maxPrice?: number
}

@EntityRepository(Product)
class ProductRepository extends Repository<Product>{
  public async findById(id: string): Promise<Product | undefined> {
    const product = await this.findOne({
      where: { id: id }
    });

    return product;
  }

  public async filterByManyOptions({
    name = '',
    categoryId,
    minPrice = 0,
    maxPrice = 999999999 
  }: ProductOptions): Promise<Product[]> {
    const filteredProducts = await this.find({
      where: [
        {
          name: Like(`%${name}%`),
          price: Between(minPrice, maxPrice),
          category: {
            id: categoryId || Not(0)
          }
        },
        {
          description: Like(`%${name}%`),
          price: Between(minPrice, maxPrice),
          category: {
            id: categoryId || Not(0)
          }
        }
      ],
      relations: ["category"],
    });

    return filteredProducts;
  }
}

export default ProductRepository;