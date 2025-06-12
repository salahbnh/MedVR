import { Schema, model } from "mongoose";

const rendezVousSchema = new Schema({
    date: {
        type: Date,
        required: true
    },
    isComplete : {
        type: Boolean,
        required: true,
        default: false
    },
    status: {
        type: String,
        default: null
    },
    patient: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    doctor: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
  });

  export default model("RendezVous",rendezVousSchema );