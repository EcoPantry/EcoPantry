import dotenv from 'dotenv';
import express from 'express';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.status(200).json({
        status: 'ok',
        message: 'healthy!'
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Server listening at http://localhost:${PORT}`);
});
