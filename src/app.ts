import express from "express";
import categoryRouter from "./routes/category.routes";
import productRouter from "./routes/product.routes";

const app = express();
app.use(express.json());
app.use('/product', productRouter);
app.use('/category', categoryRouter);

export default app;