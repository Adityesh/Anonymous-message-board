const mongoose = require('mongoose');

const ThreadSchema = mongoose.Schema({
    board : {type : String, required : true},
    text : {type : String, required : true},
    delete_password : {type : String, required : true},
    created_on : {type : Date, default : Date.now},
    bumped_on : {type : Date, default : Date.now},
    reported : {type : Boolean, default : false},
    replies : {type : [{
        text : {type : String, required : true},
        delete_password : {type : String, required : true},
        created_on : {type : Date, default : Date.now},
        reported : {type : Boolean, default : false},
    }], default : []},
    replycount : {type : Number, default : 0}
})


module.exports = mongoose.model('Thread', ThreadSchema);