import { celebrate, Joi, Segments } from "celebrate";
import { Router } from "express";
import userController from "../controllers/user.controller";

const userRouter = Router();

userRouter.post('/login', celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().max(255).required()
  })
}), userController.login);

userRouter.post('/', celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().max(255).required(),
    passwordConfirmation: Joi.any().valid(Joi.ref('password')).required()
  })
}), userController.create);

export default userRouter;