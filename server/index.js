import express from "express";
import cors from "cors";

const app = express();
const port = 7777;

app.use(express.json());
app.use(cors());

app.listen(port, () => {
    console.log(`here is ${port}`);
});
