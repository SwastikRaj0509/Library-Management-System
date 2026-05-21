import mongoose from "mongoose";

const borrowSchema = new mongoose.Schema(
{
   user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
   },

   book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true
   },

   borrowDate: {
      type: Date,
      default: Date.now
   },

   dueDate: {
      type: Date,
      required: true
   },

   returnDate: {
      type: Date
   },

   fine: {
   type: Number,
   default: 0
   },

   isOverdue: {
   type: Boolean,
   default: false
   },

   status: {
      type: String,
      enum: ["borrowed", "returned"],
      default: "borrowed"
   }

},
{
   timestamps: true
}
);

const Borrow = mongoose.model("Borrow", borrowSchema);

export default Borrow;