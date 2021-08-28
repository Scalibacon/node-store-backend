import { EntityRepository, Repository } from "typeorm";
import { Product } from "../models/Product";

@EntityRepository(Product)
export default class ProductRepository extends Repository<Product>{
  public async findByName(name: string): Promise<Product[]>{
    console.log(name)
    const filteredProductList = await this.find({
      where: {
        name: name
      }
    });

    return filteredProductList;
  }
}