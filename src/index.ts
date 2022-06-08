import express from "express";
import cors from "cors";
import router from "./router";

const PORT = 3003;
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router);

app.listen(PORT, () => {
  console.info(`API Server listening on port ${PORT}`);
});
