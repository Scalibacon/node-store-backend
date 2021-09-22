import { Router } from 'express';
import categoryRouter from './category.routes';
import userRouter from './user.routes';
import productRouter from './product.routes';
import adminRouter from './admin.routes';

const routes = Router();
routes.use('/product', productRouter);
routes.use('/category', categoryRouter);
routes.use('/user', userRouter);
routes.use('/admin', adminRouter);

export default routes;