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

router.get("/thread/:threadId", async(req, res) => {
    const {threadId} = req.params;

    try {
        const thread = await Thread.findOne({threadId});

        if(!thread) {
            res.status(404).json({error: "Thread not found"});
        }

        res.json(thread.messages);
    } catch(err) {
        console.log(err);
        res.status(500).json({error: "failed to fetch threads"});
    }
});

router.delete("/thread/:threadId", async(req, res) => {
    const {threadId} = req.params;
    
    try {
        const deletedThread = await Thread.findOneAndDelete({threadId});

        if(!deletedThread) {
            res.status(404).json({error: "Thread not found"});
        }

        res.status(200).json({sucess : "Thread deleted successfully"});
        
    } catch(err) {
        console.log(err);
        res.status(500).json({error: "failed to fetch threads"});
    }
});

export default router;