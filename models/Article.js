var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new LibrarySchema object
// This is similar to a Sequelize model
var ArticleSchema = new Schema({
  title: {
    type: String,
    unique: true
  },
  link: String,
  summary: String,
  comment: [{
    type: Schema.Types.ObjectId,
    ref: "Comment"
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// This creates our model from the above schema, using mongoose's model method
var Article = mongoose.model("Article", ArticleSchema);

// Export the Book model
module.exports = Article;