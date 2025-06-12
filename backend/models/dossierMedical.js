import { model, Schema } from "mongoose";

const medicalFolderSchema = new Schema({
    patient: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: null,
    },
    medications: {
        type: String,
        default:""
    },
    allergies: {
        type: String,
        default: "",
    },
    testResults: {
        type: String,
        default: "",
    },
    hash:{
        type: String,
        default: null,
    },
    // used when BLOCKCHAIN_ENABLED=false — stores which doctors have been granted access
    allowedDoctors: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }]
}, { timestamps: true });

const MedicalFolder = model('MedicalFolder', medicalFolderSchema);

export default MedicalFolder;
