import { NextFunction, Request, Response } from "express";
import Admin from "../models/Admin";
import adminService from "../services/admin.service";
import auth from "../auth/auth";
import { deleteUploadedPicture } from "../utils/deletePicture";
import ErrorMessage from "../utils/ErrorMessage";

class AdminController{
  async create(request: Request, response: Response){
    const admin = request.body as Admin;
    const createdAdmin = await adminService.create(admin);
    return response.status(createdAdmin instanceof ErrorMessage ? createdAdmin.status : 201).json(createdAdmin);
  }

  async login(request: Request, response: Response){
    const { email, password } = request.body;

    const token = await adminService.login(email, password);

    return response.status(token instanceof ErrorMessage ? token.status : 201).json(token);
  }

  authAdmin(request: Request, response: Response, next: NextFunction, permission: number = 1){
    const token = request.headers['x-access-token'] as string;
    const adminId = auth.authAdmin(token, permission);
    if(adminId instanceof ErrorMessage){
      if(request.files instanceof Array && request.files.length > 0)
        deleteUploadedPicture(request.files.map(file => file.filename));

      return response.status(adminId.status).json(adminId);
    }      
    return next();
  }
}

export default new AdminController();