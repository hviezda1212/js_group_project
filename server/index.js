import express from "express";
import cors from "cors";

const app = express();
const port = 7777;

app.use(express.json());
app.use(cors());

<<<<<<< HEAD:server/index.js
app.listen(port, () => {
    console.log(`here is ${port}`);
=======
app.listen(port, (res, req) => {
  console.log(`here is ${port}`);
>>>>>>> cfe91c93f20c7aa379b12c28281e95ff54387f89:middleware/middle.js
});
