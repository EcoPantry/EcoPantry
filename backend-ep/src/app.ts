import cors from 'cors';
import dotenv from 'dotenv';
import express from "express";

import userRoutes from './routes/user.route';

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

app.get('/', (req, res) => {
    res.status(200).json({
        status: 'ok!',
        message: 'healthy!'
    });
});

app.use('/users', userRoutes);

export default app;
