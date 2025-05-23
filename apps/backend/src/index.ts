import express, { json, urlencoded } from "express";
import { RegisterRoutes } from "../build/routes";

const app = express();

app.use(urlencoded({ extended: true }));
app.use(json());

RegisterRoutes(app);

// Get port
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
});
