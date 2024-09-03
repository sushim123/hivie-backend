import mongoose from 'mongoose';
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';

const userSchema = new mongoose.Schema(
  {
    nickname: {type: String, required: [true, 'Nickname is required']},
    name: String,
    email: {
      type: String,
      required: [true, 'Email is required'], // Custom error message if email is missing
      lowercase: true, // Convert the email to lowercase before storing
      unique: true, // Ensure that the email is unique across all users
      trim: true, // Remove whitespace from both ends of the email
      index: true // Create an index on the email field for faster lookups
    },

    // password: {type: String, required: [true, 'Password is required']},

    refreshToken: {type: String, default: ''},
    role: {
      type: String,
      enum: ['admin', 'influencer', 'brand'],
      required: true,
      default: 'influencer'
    },
    picture: {type: String, default: ''},
    sid: {type: String, default: ''},
    given_name: {type: String, default: ''},
    family_name: {type: String, default: ''},
    sub: {type: String, default: ''},
    email_verified: {type: Boolean, default: false}
  },
  {timestamps: true}
);

// Middleware to hash the user's password before saving the document (currently commented out)

// userSchema.pre('save', async function (next) {
//   try {// Check if the document is new; only hash the password if it's a new document
//     if (this.isNew) {
//       const salt = await bcrypt.genSalt(10); // Generate a salt for hashing
//       const hashedPassword = await bcrypt.hash(this.password, salt); // Hash the password with the salt
//       this.password = hashedPassword; // Replace the plain text password with the hashed password
//     }
//     next(); // Continue with the save operation
//   } catch (error) {
//     next(error); // Pass any errors to the next middleware
//   }
// });

userSchema.plugin(mongooseAggregatePaginate);
export const User = mongoose.model('User', userSchema);
