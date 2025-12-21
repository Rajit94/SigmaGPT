import express from "express";
import "dotenv/config";
import cors from "cors";


const app = express();
const PORT = 8080;

app.use(express.json());
app.use(cors());

app.listen(PORT, () => {
    console.log(`server running on ${PORT}`);
});

app.post("/test", async (req, res) => {
const options = {
method: "POST",
headers: {
"Content-Type": "application/json",
"Authorization": `Bearer ${process.env.OPEΝΑΙ_API_KEY}`
},

body: JSON.stringify({
model: "gpt-40-mini",
messages: [{
role: "user",
content: req.body.message
}]
})
};

try {
const response = await fetch("https://api.openai.com/v1/chat/completions", options);
const data = await response.json();

//console.log(data.choices[0].message.content); //reply

res.send(data.choices[0].message.content);
} catch(err) {
console.log(err);
}
});