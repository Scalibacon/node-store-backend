import { Router } from 'express';
import productController from '../controllers/ProductController';

const productRouter = Router();

productRouter.post('/', productController.create);

productRouter.get('/', productController.list);

productRouter.get('/:name', productController.filterByName)

export default productRouter;