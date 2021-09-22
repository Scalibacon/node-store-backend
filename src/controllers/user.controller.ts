import { Request, Response } from "express";
import User from "../models/User";
import userService from "../services/user.service";
import ErrorMessage from "../utils/ErrorMessage";

class UserController{
  async login(request: Request, response: Response){
    const { email, password } = request.body;

    const token = await userService.login(email, password);

    return response.status(token instanceof ErrorMessage ? token.status : 201).json(token);
  }

  async create(request: Request, response: Response){
    const user = request.body as User;

    const createdUser = await userService.create(user);

    return response.status(createdUser instanceof ErrorMessage ? createdUser.status : 201).json(createdUser);
  }
}

export default new UserController();