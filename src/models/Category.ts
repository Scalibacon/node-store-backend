import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./Product";

@Entity()
export class Category {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column()
  name!: string;

  @OneToMany(() => Product, product => product.category)
  products!: Product[];
}