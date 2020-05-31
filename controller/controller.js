const Thread = require('../model/Thread')

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
            res.redirect(`/b/${board}/`);
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
                thread.replycount++;
                thread.replies.push(newReply);
                await thread.save();
            }

            res.redirect(`/b/${board}/${thread_id}`);
        }


    },

    async getRecent(req, res) {
        const board = req.params.board;
        const threads = await Thread.find({board},'-reported -delete_password -__v').limit(10).sort({bumped_on:-1});
        threads.map(thread => {
            thread.replycount = thread.replies.length;
            thread.replies.sort((a, b) => b - a);
            thread.replies = thread.replies.slice(Math.max(thread.replies.length - 3, 0)).reverse()
              
              thread.replies = thread.replies.map(reply => {
                const testObj = reply.toObject()
                delete testObj.delete_password;
                delete testObj.reported;
                return testObj
              })
            })
          

        res.json(threads)
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

    async deleteReply(req, res) {
        const {thread_id, reply_id, delete_password} = req.body;
        const board = req.params.board;
        let error = "";
        const thread = await Thread.findById(thread_id);
        if(!thread) {
            res.status(400).send("thread doesn't exist");
        } else {
            thread.replies = thread.replies.map(reply => {
                if(reply._id == reply_id) {
                    if(reply.delete_password == delete_password) {
                        reply.text = "[deleted]";
                        error = "success";
                    }
                } else {
                    error = "incorrect password";
                }
                return reply;
            })

            await thread.save();
            res.json(error);
        }
    },

    async reportThread(req, res) {

    },

    async reportReply(req, res) {

    }


}