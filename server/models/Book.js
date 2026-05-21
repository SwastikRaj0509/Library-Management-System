import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
{
   title: {
      type: String,
      required: true
   },

   author: {
      type: String,
      required: true
   },

   category: {
      type: String,
      required: true
   },

   isbn: {
      type: String,
      required: true,
      unique: true
   },

   publisher: {
      type: String
   },

   quantity: {
      type: Number,
      required: true,
      default: 1
   },

   availableCopies: {
      type: Number,
      required: true,
      default: 1
   },

   description: {
      type: String
   },

   image: {
      type: String
   }

},
{
   timestamps: true
}
);

const Book = mongoose.model("Book", bookSchema);

export default Book;