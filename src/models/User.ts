import { Entity } from "typeorm";
import Person from "./Person";

@Entity()
export default class User extends Person{

}