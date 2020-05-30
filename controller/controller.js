const Thread = require('../model/Thread')
const ObjectId = require('mongoose').Types.ObjectId;
module.exports = {
    async postThread(req, res) {
        const {text, delete_password}  = req.body;
        const board = req.params.board;
        if(!board) res.status(400).send("No board name provided");

        if(!text || !delete_password) {
            res.status(400).send("One of the parameters is absent");
        }

        else {
            const thread = await Thread.findOne({text});
            if(!thread) {
                const newThread = new Thread({
                    board,
                    text,
                    delete_password
                })
                await newThread.save();
            } else {
                res.status(400).send(`Thread with the title "<code>${text}</code>" already exists.`);
            }
            res.redirect(`/b/${board}`);
        }
    },

    async postReply (req, res) {
        const {text, delete_password, thread_id} = req.body;
        const board = req.params.board;

        if(!board) res.status(400).send("No board name provided");

        if(!text || !delete_password || !thread_id) {
            res.status(400).send("One of the parameters is absent");
        } else {
            const thread = await Thread.findOne({board, _id : thread_id});
            if(!thread) {
                res.status(400).send(`No thread with the given id`);
            } else {
                const newReply = {
                    text,
                    delete_password
                }
                thread.bumped_on = Date.now();
                thread.replies.push(newReply);
                await thread.save();
            }

            res.redirect(`/b/${board}/${thread_id}`);
        }


    },

    async getRecent(req, res) {
        const board = req.params.board;
        const threads = await Thread.find({board},'-reported -delete_password -__v').limit(10).sort({bumped_on:-1});
        const result = threads.map((thread) => {
            thread.replies = thread.replies.sort((a, b) => b-a).slice(0,3);
            thread.replies = thread.replies.map(reply => {
                reply.reported = undefined;
                reply.delete_password = undefined;
                return reply;
            })
            return thread;
        })

        res.json(result)
    },

    async getAll(req, res) {
        const thread_id = req.query.thread_id;
        const board = req.params.board;

        const thread = await Thread.findOne({board, _id : thread_id},'-__v -reported -delete_password');
        if(!thread) {
            res.status(400).send("Thread id invalid");

        } else {
            thread.replies = thread.replies.map(reply => {
                reply.reported = undefined;
                reply.delete_password = undefined;
                return reply;
            })
            res.json(thread);
        }

    },

    async deleteThread(req , res) {
        const board = req.params.board;
        const {thread_id, delete_password} = req.body;
        const deleted = await Thread.findOneAndDelete({board,_id : thread_id,delete_password});
        if(!deleted) {
            res.status(400).send("incorrect password");

        } else {
            res.json("Success");
        }
    },

    //DELETE NOT WORKInGG
    async deleteReply(req, res) {
        const board = req.params.board;
        const {thread_id, reply_id, delete_password} = req.body;
        const thread = await Thread.findOne({board, _id : thread_id});
        if(!thread) res.send('incorrect password');
        else {
            thread.replies = thread.replies.map(reply => {

                console.log(reply._id.toString() === reply_id);
                if((reply.delete_password === delete_password)) {
                    reply.text = "[deleted]";
                } 
                return reply;
            })
            
        }
        await thread.save();
        

        res.send('success');
    },

    async reportThread(req, res) {

    },

    async reportReply(req, res) {

    }


}