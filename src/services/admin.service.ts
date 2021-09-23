import jwt from "jsonwebtoken";
import md5 from "md5";
import DBConnection from "../database/DBConnection";
import Admin from "../models/Admin";
import ErrorMessage from "../utils/ErrorMessage";

class AdminService{
  async create(admin: Admin): Promise<Admin | ErrorMessage>{
    try {
      const repository = DBConnection.connection.getRepository(Admin);
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

  authAdmin(token: string | undefined, permission: number = 1): string | ErrorMessage{
    try{
      if(!token){
        return new ErrorMessage('No token provided', 401);
      }
  
      const decodedAdmin = jwt.verify(token, process.env.SECRET || "secret") as Admin;
      if(!decodedAdmin.role || decodedAdmin.role < permission){
        return new ErrorMessage('Permission denied', 401);
      }
  
      // futuramente pode ser feita uma checagem no banco
      return decodedAdmin.id;
    }catch(err){
      if(err instanceof Error)
        console.log('Error trying to check jwt =>> ' + err.message);
      return new ErrorMessage('Permission denied', 401);
    }    
  }
}

export default new AdminService();