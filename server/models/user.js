import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
{
   name: {
      type: String,
      required: true
   },

   email: {
      type: String,
      required: true,
      unique: true
   },

   password: {
      type: String,
      required: true
   },

   role: {
      type: String,
      enum: ["admin", "librarian", "user"],
      default: "user"
   },

   resetPasswordToken: {
      type: String,
      default: null
   },

   resetPasswordExpires: {
      type: Date,
      default: null
   }
},
{
   timestamps: true
}
);

// HASH PASSWORD BEFORE SAVE
userSchema.pre("save", async function(next){

   if(!this.isModified("password")){
      next();
   }

   const salt = await bcrypt.genSalt(10);

   this.password = await bcrypt.hash(this.password, salt);
});

// PASSWORD MATCH FUNCTION
userSchema.methods.matchPassword = async function(enteredPassword){

   return await bcrypt.compare(
      enteredPassword,
      this.password
   );
};

const User = mongoose.model("User", userSchema);

export default User;