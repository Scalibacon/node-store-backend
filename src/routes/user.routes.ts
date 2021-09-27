import { celebrate, Joi, Segments } from "celebrate";
import { Router } from "express";
import auth from "../auth/auth";
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
    // passwordConfirmation: Joi.any().valid(Joi.ref('password')).required()
  })
}), userController.create);

userRouter.put('/:id', auth.authSamePerson, celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    id: Joi.string().uuid().required()
  }),
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    cpf: Joi.string().length(11),
  })
}), userController.update);

export default userRouter;