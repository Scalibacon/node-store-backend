import { celebrate, Joi, Segments } from 'celebrate';
import { Router } from 'express';
import productController from '../controllers/ProductController';
import upload from '../config/uploads';

const productRouter = Router();

productRouter.post('/', upload.single('picture'), celebrate({
  [Segments.BODY] : Joi.object().keys({
    name: Joi.string().required(),
    price: Joi.number().positive().precision(2).required(),
    inventory: Joi.number().integer().positive().default(0),
    description: Joi.string(),
    categoryId: Joi.number().integer().positive().required()
  })
}), productController.create);

productRouter.put('/', upload.single('picture'), celebrate({
  [Segments.BODY] : Joi.object().keys({
    id: Joi.string().uuid().required(),
    name: Joi.string().required(),
    price: Joi.number().positive().precision(2).required(),
    inventory: Joi.number().integer().positive().required(),
    description: Joi.string(),
    categoryId: Joi.number().integer().positive().required()
  })
}), productController.update);

productRouter.get('/', celebrate({
  [Segments.QUERY] : Joi.object().keys({
    name: Joi.string(),
    minPrice: Joi.number().positive().precision(2),
    maxPrice: Joi.number().positive().precision(2),
    categoryId: Joi.number().integer().positive()
  })
}), productController.filterByManyOptions);

productRouter.get('/:id', celebrate({
  [Segments.PARAMS] : Joi.object().keys({
    id: Joi.string().uuid().required()
  })
}), productController.findById);

export default productRouter;