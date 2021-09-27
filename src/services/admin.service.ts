import jwt from "jsonwebtoken";
import md5 from "md5";
import DBConnection from "../database/DBConnection";
import Admin from "../models/Admin";
import ErrorMessage from "../utils/ErrorMessage";

class AdminService{
  async create(admin: Admin): Promise<Admin | ErrorMessage>{
    try {
      const repository = DBConnection.connection.getRepository(Admin);
      admin.password = md5(admin.password);
      const createdAdmin = await repository.save(admin);

      return createdAdmin;
    } catch(err){
      if(err instanceof Error)
        console.log('Error trying to create a new admin =>> ' + err.message);
      return new ErrorMessage('Error trying to create a new admin'); 
    }    
  }

  async login(email: string, password: string): Promise<String | ErrorMessage>{
    try {
      let token: String | undefined;
      const repository = DBConnection.connection.getRepository(Admin);
      const admin = await repository.findOne({
        where: {
          email: email,
          password: md5(password)
        }
      });

      if(!admin){
        return new ErrorMessage('Invalid e-mail or password', 400);        
      }
        
      token = jwt.sign({ id: admin.id, role: admin.role }, process.env.SECRET ?? "");
      return token;

    } catch(err){
      if(err instanceof Error)
        console.log('Error trying to log in =>> ' + err.message);      
      return new ErrorMessage('Error trying to log in');
    }
  }  
}

export default new AdminService();