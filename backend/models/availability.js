import { Schema, model } from "mongoose";

const availabilitySchema = new Schema({
    doctor: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    dayOfWeek: {
        type: Number,
        min: 0,
        max: 6,
        required: true
    }, // 0=Sunday, 1=Monday, ..., 6=Saturday
    startTime: {
        type: String,
        required: true,
        match: /^([01]\d|2[0-3]):([0-5]\d)$/
    }, // "09:00"
    endTime: {
        type: String,
        required: true,
        match: /^([01]\d|2[0-3]):([0-5]\d)$/
    }, // "17:00"
    slotDurationMinutes: {
        type: Number,
        default: 30,
        min: 10,
        max: 120
    }
});

availabilitySchema.index({ doctor: 1, dayOfWeek: 1 }, { unique: true });

export default model('Availability', availabilitySchema);
