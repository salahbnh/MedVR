import Availability from '../models/availability.js';
import RendezVous from '../models/rendez_vous.js';
import User from '../models/user.js';

export async function setAvailability(req, res) {
    try {
        const { doctorId, dayOfWeek, startTime, endTime, slotDurationMinutes } = req.body;

        const doctor = await User.findOne({ _id: doctorId, role: 'doctor' });
        if (!doctor) {
            return res.status(404).json({ error: 'Doctor not found' });
        }

        const availability = await Availability.findOneAndUpdate(
            { doctor: doctorId, dayOfWeek },
            { startTime, endTime, slotDurationMinutes: slotDurationMinutes || 30 },
            { upsert: true, new: true, runValidators: true }
        );

        return res.status(200).json({ availability });
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

export async function getDoctorAvailability(req, res) {
    try {
        const { doctorId } = req.params;
        const availability = await Availability.find({ doctor: doctorId }).sort({ dayOfWeek: 1 });
        return res.status(200).json({ availability });
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

export async function getAvailableSlots(req, res) {
    try {
        const { doctorId, date } = req.query;

        if (!doctorId || !date) {
            return res.status(400).json({ error: 'doctorId and date are required' });
        }

        const requestedDate = new Date(date);
        if (isNaN(requestedDate.getTime())) {
            return res.status(400).json({ error: 'Invalid date' });
        }

        const dayOfWeek = requestedDate.getDay();
        const availability = await Availability.findOne({ doctor: doctorId, dayOfWeek });

        if (!availability) {
            return res.status(200).json({ slots: [] });
        }

        // generate all slots for the day
        const [startH, startM] = availability.startTime.split(':').map(Number);
        const [endH, endM] = availability.endTime.split(':').map(Number);
        const startMinutes = startH * 60 + startM;
        const endMinutes = endH * 60 + endM;

        const allSlots = [];
        for (let m = startMinutes; m < endMinutes; m += availability.slotDurationMinutes) {
            const slot = new Date(requestedDate);
            slot.setHours(Math.floor(m / 60), m % 60, 0, 0);
            allSlots.push(slot);
        }

        // filter out already-booked slots
        const startOfDay = new Date(requestedDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(requestedDate);
        endOfDay.setHours(23, 59, 59, 999);

        const booked = await RendezVous.find({
            doctor: doctorId,
            date: { $gte: startOfDay, $lte: endOfDay }
        });

        const bookedTimes = new Set(booked.map(rdv => new Date(rdv.date).getTime()));
        const availableSlots = allSlots.filter(slot => !bookedTimes.has(slot.getTime()));

        return res.status(200).json({ slots: availableSlots });
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

export async function deleteAvailability(req, res) {
    try {
        const { doctorId, dayOfWeek } = req.body;

        const deleted = await Availability.findOneAndDelete({ doctor: doctorId, dayOfWeek });
        if (!deleted) {
            return res.status(404).json({ error: 'Availability slot not found' });
        }

        return res.status(200).json({ message: 'Availability deleted successfully' });
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
