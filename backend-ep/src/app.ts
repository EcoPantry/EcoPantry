import dotenv from 'dotenv';
import express from 'express';
import userRoutes from './routes/user.route';

dotenv.config();

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).json({
        status: 'ok!',
        message: 'healthy!'
    });
});

app.use('/users', userRoutes);

export default app;
