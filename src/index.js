import express from "express";
import { PORT } from "./config.js";
import userRoutes from "./routes/users.route.js";

const app = express();

app.use(express.json()); // IMPORTANTÍSIMO para leer JSON del body
app.use(userRoutes);

app.listen(PORT, () => {
  console.log("server on port", PORT);
});
