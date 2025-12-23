import express from "express";
import Thread from "../models/Thread.js";

const router = express.Router();

router.post("/test", async(req, res) => {
    try {
        const thread = new Thread({
            threadId: "xyz",
            title: "Testing New Thread"
        });

        const response = await thread.save();
        res.send(response);
    } catch(err) {
        console.log(err);
        res.status(500).json({error: "failed to save in Db"});
    }
});

//get all threads
router.get("/thread", async(req, res) => {
    try {
        const threads = await Thread.find({}).sort({ updatedAt:-1});
        //descending order of updatedAt... most recent chat on top 
        res.json(threads);
    } catch(err) {
        console.log(err);
        res.status(500).json({error: "failed to fetch threads"});
    }
});

export default router;