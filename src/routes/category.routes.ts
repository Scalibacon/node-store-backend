import { Router } from "express";
import { celebrate, Joi, Segments } from "celebrate";
import categoryController from "../controllers/category.controller";
import auth from "../auth/auth";

const categoryRouter = Router();

categoryRouter.post('/', auth.authAdmin, celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required()
  })
}), categoryController.create);

categoryRouter.get('/', categoryController.list);

export default categoryRouter;