import { Column, Entity } from "typeorm";
import Person from "./Person";

@Entity()
export default class Admin extends Person{
  @Column()
  role!: number;

  @Column({ name: "is_active" })  
  isActive!: boolean;
}