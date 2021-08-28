import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./Product";

@Entity()
export class Picture {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column({ name: 'image_path' })
  imagePath!: string;

  @Column()
  order?: number;

  @Column({ name: 'product_id' })
  productId!: string;

  @ManyToOne(() => Product, product => product.pictures)
  @JoinColumn({ name: 'product_id' })
  product!: Product;
}