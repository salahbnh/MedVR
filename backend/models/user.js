import { Schema, model } from "mongoose";
import bcrypt from 'bcrypt';

const userSchema = new Schema({
  fName: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 30
  },
  lName: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    validate: {
      validator: (v) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v),
      message: 'Please provide a valid email address.'
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 8, 
    match: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/,
    message: 'Password must contain at least 8 characters, including 1 lowercase letter, 1 uppercase letter, 1 number, and 1 special character.'
  },
  address: {
    type: String,
    required: true,
    length: 50, 
  },
  phoneNbr: {
    type: String,
    required: true,
    length: 8, 
  },
  role: {
    type: String,
    enum: ['doctor', 'patient'],
    required: true,
    default: 'patient'
  },
  profilePicture: {
    type: String,
    default: null
  },
  ethAddress:{
    type: String,
    default:"",
  }
});

userSchema.add({
  specialization: {
    type: String,
    required: function() { return this.role === 'doctor'; }
  },
  yearsOfExperience: {
    type: Number,
    min: 0,
    max: 100,
    required: function() { return this.role === 'doctor'; }
  },
  wallet: {
    type: Number,
    default: 0,
    required: function() { return this.role === 'doctor'; }
  },
  patients: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: null,
    required: function() { return this.role === 'doctor'; }
  }],
  passwordResetToken: {
    type: String,
    default: null,
  },
  passwordResetExpires: {
    type: Date,
    default: null,
  },
  refreshToken: {
    type: String,
    default: null,
  },

});

userSchema.add({
  dateOfBirth: {
    type: Date,
    required: function() { return this.role === 'patient'; }
  },
  doctors: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: null,
    required: function() { return this.role === 'patient'; }
  }],
});

userSchema.index({ email: 1 }, { unique: true });

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

export default model("User",userSchema);