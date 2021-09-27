import { celebrate, Joi, Segments } from "celebrate";
import { Router } from "express";
import auth from "../auth/auth";
import adminController from "../controllers/admin.controller";

const adminRouter = Router();

adminRouter.post('/login', celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().max(255).required()
  })
}), adminController.login);

adminRouter.post('/', auth.authAdmin, celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    cpf: Joi.string().length(11),
    role: Joi.number().integer().default(1),
    isActive: Joi.boolean().default(true)
  })
}), adminController.create);

export default adminRouter;