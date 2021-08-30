import { EntityRepository, Repository } from "typeorm";
import { Product } from "../models/Product";

@EntityRepository(Product)
export default class ProductRepository extends Repository<Product>{
  public async findById(id: string): Promise<Product|undefined>{
    const product = await this.findOne({
      where: { id: id }
    });

    return product;
  }
}