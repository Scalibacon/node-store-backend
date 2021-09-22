import { celebrate, Joi, Segments } from "celebrate";
import { Router } from "express";
import adminController from "../controllers/admin.controller";

const adminRouter = Router();

adminRouter.post('/login', celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().max(255).required()
  })
}), adminController.login);

export default adminRouter;