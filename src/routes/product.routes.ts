import { celebrate, Joi, Segments } from 'celebrate';
import { Router } from 'express';
import productController from '../controllers/product.controller';
import upload from '../config/uploads';
import adminController from '../controllers/admin.controller';

const productRouter = Router();

productRouter.post('/', upload.array('pictures', 1), adminController.authAdmin, celebrate({
  [Segments.BODY] : Joi.object().keys({
    name: Joi.string().required(),
    price: Joi.number().positive().precision(2).required(),
    inventory: Joi.number().integer().positive().default(0),
    description: Joi.string(),
    categoryId: Joi.number().integer().positive().required()
  })
}), productController.create);

productRouter.put('/:id', upload.array('pictures', 1), adminController.authAdmin, celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    id: Joi.string().uuid().required(),
  }),
  [Segments.BODY] : Joi.object().keys({
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

productRouter.use(productController.deletePictureOnError);

export default productRouter;