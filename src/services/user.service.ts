import md5 from "md5";
import jwt from 'jsonwebtoken';
import DBConnection from "../database/DBConnection";
import User from "../models/User";
import ErrorMessage from "../utils/ErrorMessage";

class UserService{
  async login(email: string, password: string): Promise<String | ErrorMessage>{
    try {
      let token: String | undefined;
      const repository = DBConnection.connection.getRepository(User);
      const user = await repository.findOne({
        where: {
          email: email,
          password: md5(password)
        }
      });

      if(!user){
        return new ErrorMessage('Invalid e-mail or password', 400);        
      }
        
      token = jwt.sign({ id: user.id }, process.env.SECRET ?? "");
      return token;

    } catch(err){
      if(err instanceof Error)
        console.log('Error trying to log in =>> ' + err.message);      
      return new ErrorMessage('Error trying to log in');
    }
  }

  async create(user: User): Promise<User | ErrorMessage> {
    try {
      const repository = DBConnection.connection.getRepository(User);
      user.password = md5(user.password);
      const createdUser = await repository.save(user);

      return createdUser;
    } catch(err){
      if(err instanceof Error)
        console.log('Error trying to create user =>> ' + err.message);      
      return new ErrorMessage('Error trying to create user');
    }
  }

  async update(user: User): Promise<User | ErrorMessage>{
    try{
      const repository = DBConnection.connection.getRepository(User);
      const updatedUser = await repository.save(user);

      return updatedUser;
    }catch(err){
      if(err instanceof Error)
        console.log('Error trying to update user =>> ' + err.message);      
      return new ErrorMessage('Error trying to update user');
    }
  }

  async findById(id: string): Promise<User | undefined | ErrorMessage>{
    try{
      const repository = DBConnection.connection.getRepository(User);
      const userFound = await repository.findOne({
        where: { id }
      });
      if(!userFound)
        return new ErrorMessage('User not found', 404);

      return userFound;
    } catch(err){
      if(err instanceof Error)
        console.log('Error trying to find user by id =>> ' + err.message);
      return new ErrorMessage('Error trying to find user by id'); 
    }    
  }
}

export default new UserService();