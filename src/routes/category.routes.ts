import { Router } from "express";
import categoryController from "../controllers/CategoryController";

const categoryRouter = Router();

categoryRouter.post('/', categoryController.create);

categoryRouter.get('/', categoryController.list);

export default categoryRouter;