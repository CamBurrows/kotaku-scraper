var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new LibrarySchema object
// This is similar to a Sequelize model
var CommentSchema = new Schema({
  nickname: {
      type: String,
      default: "Anonymous"
    },
  body: String,
  timestamp: {
      type: Date,
      default: Date.now
  }
});

// This creates our model from the above schema, using mongoose's model method
var Comment = mongoose.model("Comment", CommentSchema);

// Export the Book model
module.exports = Comment;