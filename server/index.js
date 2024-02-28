import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.get("/currencies/:coin", async (req, res) => {
    const { coin } = req.params;
    try {
        const response = await fetch(
            `https://api.coinone.co.kr/public/v2/currencies/${coin}`
        );
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
