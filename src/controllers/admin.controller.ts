import { Request, Response } from "express";
import adminService from "../services/admin.service";
import ErrorMessage from "../utils/ErrorMessage";

class AdminController{
  async login(request: Request, response: Response){
    const { email, password } = request.body;

    const token = await adminService.login(email, password);

    return response.status(token instanceof ErrorMessage ? token.status : 201).json(token);
  }
}

export default new AdminController();