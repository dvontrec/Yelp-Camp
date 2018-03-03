var mongoose = require("mongoose");

//create comment schema
var commentSchema = mongoose.Schema({
    text: String,
    author: 
    {
        id:
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        },
        username: String
    }
});


module.exports = mongoose.model("Comment", commentSchema);