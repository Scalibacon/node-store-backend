import { NextFunction, Request, Response } from "express";
import adminService from "../services/admin.service";
import ErrorMessage from "../utils/ErrorMessage";

class AdminController{
  async login(request: Request, response: Response){
    const { email, password } = request.body;

    const token = await adminService.login(email, password);

    return response.status(token instanceof ErrorMessage ? token.status : 201).json(token);
  }

  authAdmin(request: Request, response: Response, next: NextFunction, permission: number = 1){
    const token = request.headers['x-access-token'] as string;
    const adminId = adminService.authAdmin(token, permission);
    if(adminId instanceof ErrorMessage)
      return response.status(adminId.status).json(adminId);
    // request.body.adminId = adminId;
    next();
  }
}

export default new AdminController();