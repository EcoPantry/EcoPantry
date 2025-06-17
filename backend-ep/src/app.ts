import cors from 'cors';
import dotenv from 'dotenv';
import express from "express";
import cookieParser from 'cookie-parser';

import userRoutes from './routes/user.route';
import recipeRouter from './routes/recipeRouter';
import authRouter from './routes/auth/index';
import ingredientRouter from './routes/ingredientRouter';
import brandRouter from './routes/brandRouter';
import userInventoryRouter from './routes/userInventoryRouter';
import productRouter from './routes/productRouter';
import esgRouter from './routes/esgRouter';

dotenv.config();

const app = express();

// app.use((req, res, next) => {
//     console.log("→ Incoming request:", req.method, req.url, "Origin:", req.headers.origin);
//     next();
// });


const FRONTEND_ORIGIN = "http://fe-bucket-ecopantry.s3-website-ap-southeast-1.amazonaws.com";


// ✅ Apply CORS first and globally
app.use(cors({
    origin: FRONTEND_ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// ✅ Allow preflight from browser
// app.options("*", cors({
//     origin: FRONTEND_ORIGIN,
//     credentials: true
// }));


app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
    res.status(200).json({
        status: 'ok!',
        message: 'healthy!'
    });
});

app.use('/api/users', userRoutes); 
app.use('/api/auth', authRouter);

app.use('/api/recipes', recipeRouter);
app.use('/api/ingredients', ingredientRouter);
app.use('/api/brands', brandRouter);
app.use("/api/user-inventory", userInventoryRouter);
app.use('/api/products', productRouter);
app.use("/api/brands", esgRouter);


export default app;
