import { validationResult } from 'express-validator';
import RendezVous from '../models/rendez_vous.js';
import Notification from '../models/notification.js';
import { createTransport } from 'nodemailer';
import User from '../models/user.js';
import { Types } from 'mongoose';

function getMailTransporter() {
    return createTransport({
        service: 'gmail',
        auth: {
            user: process.env.USER,
            pass: process.env.APP_PASSWORD,
        },
    });
}

function sendMail(to, subject, text) {
    if (!process.env.USER || !process.env.APP_PASSWORD) return;
    getMailTransporter().sendMail(
        { from: process.env.USER, to, subject, text },
        (error, info) => {
            if (error) console.error('Error sending email:', error);
            else console.log('Email sent:', info.response);
        }
    );
}

export async function BookRDV(req, res) {
    try {
        const [patient, doctor] = await Promise.all([
            User.findById(req.body.patientId),
            User.findById(req.body.doctorId)
        ]);

        if (!patient || !doctor) {
            return res.status(404).json({ error: 'Patient or doctor not found' });
        }

        // conflict check: doctor already has an appointment at that exact time
        const conflict = await RendezVous.findOne({
            doctor: req.body.doctorId,
            date: new Date(req.body.date),
        });
        if (conflict) {
            return res.status(409).json({ error: 'Doctor is already booked at this time' });
        }

        const newRDV = await RendezVous.create({
            date: req.body.date,
            patient: req.body.patientId,
            doctor: req.body.doctorId,
        });

        // update doctor.patients and patient.doctors arrays
        await Promise.all([
            User.findByIdAndUpdate(req.body.doctorId, { $addToSet: { patients: req.body.patientId } }),
            User.findByIdAndUpdate(req.body.patientId, { $addToSet: { doctors: req.body.doctorId } }),
        ]);

        // send confirmation emails to both doctor and patient
        sendMail(
            doctor.email,
            'New Appointment Booked',
            `You have a new appointment on ${req.body.date} with patient ${patient.fName} ${patient.lName}.`
        );
        sendMail(
            patient.email,
            'Appointment Confirmation',
            `Your appointment with Dr. ${doctor.fName} ${doctor.lName} on ${req.body.date} has been confirmed.`
        );

        return res.status(201).json({ _id: newRDV.id });
    } catch (error) {
        console.error('Error creating rendezvous:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

export async function deleteRDV(req, res) {
    try {
        const { rdvId } = req.params;
        const { reason } = req.body;

        const deletedRDV = await RendezVous.findByIdAndDelete(new Types.ObjectId(rdvId))
            .populate('patient', 'fName lName email')
            .populate('doctor', 'fName lName email');

        if (!deletedRDV) {
            return res.status(404).json({ error: 'RendezVous not found' });
        }

        // notify both parties
        const notifText = `Your appointment on ${deletedRDV.date.toISOString().split('T')[0]} was canceled. Reason: ${reason || 'No reason provided'}`;

        await Promise.all([
            Notification.create({ user: deletedRDV.patient._id, type: 'Rendez-vous canceled', text: notifText }),
            Notification.create({ user: deletedRDV.doctor._id, type: 'Rendez-vous canceled', text: notifText }),
        ]);

        sendMail(deletedRDV.patient.email, 'Appointment Canceled', notifText);
        sendMail(deletedRDV.doctor.email, 'Appointment Canceled', notifText);

        return res.status(200).json({ message: `RendezVous ${rdvId} canceled successfully.` });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

export async function setRdvFinished(req, res) {
    try {
        const updatedRDV = await RendezVous.findByIdAndUpdate(
            req.params.id,
            { isComplete: true },
            { new: true }
        );

        if (!updatedRDV) {
            return res.status(404).json({ error: 'RendezVous not found' });
        }

        return res.status(200).json({ message: `RendezVous ${req.params.id} marked as finished.` });
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

export async function getAllRdvByUserId(req, res) {
    try {
        const { userId } = req.params;
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));
        const skip = (page - 1) * limit;

        const [rendezVous, total] = await Promise.all([
            RendezVous.find({ $or: [{ doctor: userId }, { patient: userId }] })
                .populate('doctor', 'fName lName email specialization')
                .populate('patient', 'fName lName email dateOfBirth')
                .sort({ date: 1 })
                .skip(skip)
                .limit(limit),
            RendezVous.countDocuments({ $or: [{ doctor: userId }, { patient: userId }] })
        ]);

        return res.status(200).json({
            rendezVous,
            pagination: { total, page, limit, pages: Math.ceil(total / limit) }
        });
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

export async function SendCodeEmail(req, res) {
    try {
        const { email, code } = req.body;

        sendMail(email, 'Verification Code', `Your verification code is: ${code}`);

        return res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

export async function CheckRdvStatus(req, res) {
    try {
        const { rendezVousId } = req.body;

        const rdv = await RendezVous.findById(rendezVousId);
        if (!rdv) {
            return res.status(404).json({ error: 'RendezVous not found' });
        }

        const now = new Date();
        const rdvDate = new Date(rdv.date);
        const diffMs = rdvDate.getTime() - now.getTime();
        const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

        let newStatus;
        if (diffDays > 7) {
            newStatus = 'In more than a week';
        } else if (diffDays > 1) {
            newStatus = `In ${diffDays} days`;
        } else if (diffDays === 1) {
            newStatus = 'In one day';
        } else {
            const diffHours = Math.ceil(diffMs / (1000 * 60 * 60));
            if (diffHours > 0) {
                newStatus = `In ${diffHours} hours`;
            } else {
                await RendezVous.findByIdAndDelete(rendezVousId);
                return res.status(200).json({ message: 'Rendez-vous has passed and deleted.' });
            }
        }

        rdv.status = newStatus;
        await rdv.save();

        return res.status(200).json({ message: 'Rendez-vous status updated successfully.', status: newStatus });
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
