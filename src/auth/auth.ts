import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin";
import Person from "../models/Person";
import { deleteUploadedPicture } from "../utils/deletePicture";
import ErrorMessage from "../utils/ErrorMessage";

class Auth{
  authAdmin(request: Request, response: Response, next: NextFunction, permission: number = 1){
    try{
      const token = request.headers['x-access-token'] as string;
      if(!token)
        throw new Error('No token provided');      
  
      const decodedAdmin = jwt.verify(token, process.env.SECRET || "secret") as Admin;
      if(!decodedAdmin.id || !decodedAdmin.role || decodedAdmin.role < permission)
        throw new Error('Permission denied');      

      return next();
    }catch(err){
      if(err instanceof Error)
        console.log('Error trying to check jwt =>> ' + err.message);
      if(request.files instanceof Array && request.files.length > 0)
        deleteUploadedPicture(request.files.map(file => file.filename));
      const errorMsg = new ErrorMessage('Permission denied', 401);
      return response.status(errorMsg.status).json(errorMsg);
    }    
  }

  authSamePerson(request: Request, response: Response, next: NextFunction, permission: number = 1){
    try{
      const token = request.headers['x-access-token'] as string;
      const personId = request.params.id;

      if(!token)
        throw new Error('No token provided');      
  
      const decodedPerson = jwt.verify(token, process.env.SECRET || "secret") as Person;
      if(!decodedPerson.id || decodedPerson.id !== personId)
        throw new Error('Permission denied');      

      return next();
    }catch(err){
      if(err instanceof Error)
        console.log('Error trying to check jwt =>> ' + err.message);
      const errorMsg = new ErrorMessage('Permission denied', 401);
      return response.status(errorMsg.status).json(errorMsg);
    }    
  }
}

export default new Auth();