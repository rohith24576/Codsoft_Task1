import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';

const app = express();

app.use(cors({
    origin: "*",
    credentials: true
}));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());
app.use(morgan('dev'));

// Routes import
import userRouter from './routes/user.routes.js';
import productRouter from './routes/product.routes.js';
import categoryRouter from './routes/category.routes.js';
import orderRouter from './routes/order.routes.js';
import couponRouter from './routes/coupon.routes.js';

// Routes declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/coupons", couponRouter);

export { app };
