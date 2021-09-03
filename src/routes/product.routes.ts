import { celebrate, Joi, Segments } from 'celebrate';
import { Router } from 'express';
import productController from '../controllers/ProductController';

const productRouter = Router();

productRouter.post('/', celebrate({
  [Segments.BODY] : Joi.object().keys({
    name: Joi.string().required(),
    price: Joi.number().positive().precision(2).required(),
    inventory: Joi.number().integer().positive().default(1),
    description: Joi.string(),
    category: Joi.object().keys({
      id: Joi.number().integer().positive().required()
    }),
    pictures: Joi.array().optional().items(Joi.object().keys({
      imagePath: Joi.string().required(),
      order: Joi.number().integer().positive().default(1)
    }))
  })
}), productController.create);

productRouter.put('/', celebrate({
  [Segments.BODY] : Joi.object().keys({
    id: Joi.string().uuid().required(),
    name: Joi.string().required(),
    price: Joi.number().positive().precision(2).required(),
    inventory: Joi.number().integer().positive().required(),
    description: Joi.string(),
    category: Joi.object().keys({
      id: Joi.number().integer().positive().required()
    }),
    pictures: Joi.array().optional().items(Joi.object().keys({
      id: Joi.number().integer().positive().required(),
      imagePath: Joi.string().required(),
      order: Joi.number().integer().positive()
    }))
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