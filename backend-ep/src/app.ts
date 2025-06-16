import cors from 'cors';
import dotenv from 'dotenv';
import express from "express";
import cookieParser from 'cookie-parser';

import userRoutes from './routes/user.route';
import recipeRouter from './routes/recipeRouter';
import authRouter from './routes/auth/index';

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

export default app;
