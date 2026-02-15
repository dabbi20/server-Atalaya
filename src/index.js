import express from "express";
import cors from "cors";
import { PORT } from "./config.js";
import userRoutes from "./routes/users.route.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", userRoutes);

app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});
