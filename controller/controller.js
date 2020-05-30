const Thread = require('../model/Thread')

module.exports = {
    async postThread(req, res) {
        const {text, delete_password}  = req.body;
        const board = req.params.board;
        if(!board) res.status(400).send("<h1>No board name provided</h1>");

        if(!text || !delete_password) {
            res.status(400).send("<h1>One of the parameters is absent.</h1>");
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
                res.status(400).send(`<h1>Thread with the title "<code>${text}</code>" already exists.</h1>`);
            }
            res.redirect(`/b/${board}`);
        }
    },

    async postReply (req, res) {

        

    },

    async getRecent(req, res) {

    },

    async getAll(req, res) {

    },

    async deleteThread(req , res) {

    },

    async deleteReply(req, res) {

    },

    async reportThread(req, res) {

    },

    async reportReply(req, res) {

    }


}