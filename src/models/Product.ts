import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Category } from "./Category";
import { Picture } from "./Picture";

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column()
  price!: number;

  @Column()
  inventory!: number;

  @Column()
  description!: string;

  @ManyToOne(() => Category, category => category.products, { eager: true })
  @JoinColumn({ name: 'category_id' })
  category!: Category;

  //Ativar caso queira gravar por categoryId, não apenas por category{ id: id }
  // @Column({ name: 'category_id' })
  // categoryId!: number;

  @OneToMany(() => Picture, picture => picture.product, { eager: true, cascade: true })
  pictures!: Picture[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}