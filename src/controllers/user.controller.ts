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

  async update(request: Request, response: Response){
    const user = request.body as User;
    user.id = request.params.id;

    const updatedUser = await userService.update(user);

    return response.status(updatedUser instanceof ErrorMessage ? updatedUser.status : 200).json(updatedUser);
  }

  async findById(request: Request, response: Response){
    const { id } = request.params;
    const userFound = await userService.findById(id);
    return response.status(userFound instanceof ErrorMessage ? userFound.status : 200).json(userFound);
  }
}

export default new UserController();