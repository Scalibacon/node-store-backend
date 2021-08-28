import { Router } from 'express';
import categoryRouter from './category.routes';
import productRouter from './product.routes';

const routes = Router();
routes.use('/product', productRouter);
routes.use('/category', categoryRouter);

export default routes;