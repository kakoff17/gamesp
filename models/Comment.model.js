const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    unique: false,
  },

  game: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Game",
  },

  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
},
{
  // this second object adds extra properties: `createdAt` and `updatedAt`    
  timestamps: true
},
);

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;