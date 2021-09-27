import jwt from "jsonwebtoken";
import Admin from "../models/Admin";
import User from "../models/User";
import ErrorMessage from "../utils/ErrorMessage";

class Auth{
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

  async authSameUser(token: string | undefined, userId: string){
    try{
      if(!token){
        return new ErrorMessage('No token provided', 401);
      }

      const decodedUser = jwt.verify(token, process.env.SECRET || "secret") as User;
      if(decodedUser.id !== userId){
        return new ErrorMessage('User ID don\'t match', 401);
      }

      return decodedUser.id;
    }catch(err){
      if(err instanceof Error)
        console.log('Error trying to check user jwt =>> ' + err.message);
      return new ErrorMessage('Permission denied', 401);
    }     
  }
}

export default new Auth();