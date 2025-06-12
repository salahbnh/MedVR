import { validationResult } from 'express-validator';
import User from '../models/user.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { createTransport } from 'nodemailer';
import crypto from 'crypto';
import isBlockchainEnabled from '../lib/blockchain.js';
import { assignEthAddressToUser } from '../middlewares/assignEthAccounts.js';
import { addMedFolder } from './dossierMedical.js';
import MedicalFolder from '../models/dossierMedical.js';

// ─── helpers ────────────────────────────────────────────────────────────────

function signAccessToken(userId) {
    return jwt.sign(
        { userId },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || '15m' }
    );
}

function signRefreshToken(userId) {
    return jwt.sign(
        { userId },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d' }
    );
}

// After patient registration: create medical folder, and if blockchain is on also assign eth + store hash
async function setupPatientAfterRegistration(patient) {
    try {
        if (isBlockchainEnabled()) {
            await assignEthAddressToUser(patient);
            if (patient.ethAddress) {
                const medfolder = await MedicalFolder.create({
                    patient: patient._id,
                    medications: '',
                    allergies: '',
                    testResults: '',
                });
                const hash = await addMedFolder(
                    `${medfolder._id}${medfolder.medications}${medfolder.allergies}${medfolder.testResults}`,
                    patient.ethAddress
                );
                medfolder.hash = hash ? hash.toString() : null;
                await medfolder.save();
            }
        } else {
            // no blockchain: just create the medical folder in MongoDB
            await MedicalFolder.create({
                patient: patient._id,
                medications: '',
                allergies: '',
                testResults: '',
            });
        }
    } catch (err) {
        console.error(`Post-registration setup failed for patient ${patient._id}:`, err.message);
    }
}

// ─── register ────────────────────────────────────────────────────────────────

export async function addDoctor(req, res) {
    try {
        const newDoctor = await User.create({
            fName: req.body.fName,
            lName: req.body.lName,
            email: req.body.email,
            password: req.body.password,
            address: req.body.address,
            phoneNbr: req.body.phoneNbr,
            role: 'doctor',
            specialization: req.body.specialization,
            yearsOfExperience: req.body.yearsOfExperience,
        });

        res.status(201).json({ _id: newDoctor.id });

        // assign eth address in background only when blockchain is enabled
        if (isBlockchainEnabled()) {
            assignEthAddressToUser(newDoctor).catch(err =>
                console.error('Eth assignment failed for doctor:', err.message)
            );
        }
    } catch (err) {
        if (err.code === 11000) {
            return res.status(409).json({ error: 'Email already in use' });
        }
        res.status(500).json({ error: err.message });
    }
}

export async function addPatient(req, res) {
    try {
        const newPatient = await User.create({
            fName: req.body.fName,
            lName: req.body.lName,
            email: req.body.email,
            password: req.body.password,
            address: req.body.address,
            phoneNbr: req.body.phoneNbr,
            role: 'patient',
            dateOfBirth: req.body.dateOfBirth,
        });

        res.status(201).json({ _id: newPatient.id });

        // create medical folder (+ eth address if blockchain on) in background after response
        setupPatientAfterRegistration(newPatient);
    } catch (err) {
        if (err.code === 11000) {
            return res.status(409).json({ error: 'Email already in use' });
        }
        res.status(500).json({ error: err.message });
    }
}

// ─── auth ────────────────────────────────────────────────────────────────────

export async function login(req, res) {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Password is invalid' });
        }

        const accessToken = signAccessToken(user._id);
        const refreshToken = signRefreshToken(user._id);

        // store refresh token (hashed) in DB
        user.refreshToken = await bcrypt.hash(refreshToken, 10);
        await user.save({ validateBeforeSave: false });

        return res.status(200).json({ user, accessToken, refreshToken });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

export async function refreshAccessToken(req, res) {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(401).json({ error: 'Refresh token required' });
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const user = await User.findById(decoded.userId);

        if (!user || !user.refreshToken) {
            return res.status(401).json({ error: 'Invalid refresh token' });
        }

        const isValid = await bcrypt.compare(refreshToken, user.refreshToken);
        if (!isValid) {
            return res.status(401).json({ error: 'Invalid refresh token' });
        }

        const newAccessToken = signAccessToken(user._id);
        return res.status(200).json({ accessToken: newAccessToken });
    } catch (err) {
        return res.status(401).json({ error: 'Refresh token expired or invalid' });
    }
}

export async function logout(req, res) {
    try {
        const user = await User.findById(req.userId);
        if (user) {
            user.refreshToken = null;
            await user.save({ validateBeforeSave: false });
        }
        return res.status(200).json({ message: 'Logged out successfully' });
    } catch (err) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

// ─── users ───────────────────────────────────────────────────────────────────

export async function findAllDoctors(req, res) {
    try {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));
        const skip = (page - 1) * limit;

        const [doctors, total] = await Promise.all([
            User.find({ role: 'doctor' })
                .select('-password -refreshToken -passwordResetToken -passwordResetExpires')
                .skip(skip)
                .limit(limit),
            User.countDocuments({ role: 'doctor' })
        ]);

        return res.status(200).json({
            doctors,
            pagination: { total, page, limit, pages: Math.ceil(total / limit) }
        });
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

export async function getUserById(req, res) {
    try {
        const user = await User.findById(req.params.userId)
            .select('-password -refreshToken -passwordResetToken -passwordResetExpires');

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

export async function getPatientsByDoctor(req, res) {
    try {
        const doctor = await User.findOne({ _id: req.params.doctorId, role: 'doctor' })
            .populate('patients', '-password -refreshToken -passwordResetToken -passwordResetExpires');

        if (!doctor) {
            return res.status(404).json({ error: 'Doctor not found' });
        }

        return res.status(200).json({ patients: doctor.patients });
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

export async function SetProfilePicture(req, res) {
    try {
        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.profilePicture = req.body.profilePicture;
        const updatedUser = await user.save();

        res.status(200).json({ message: 'Profile picture updated successfully', user: updatedUser });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

export async function loginWithId(req, res) {
    try {
        const user = await User.findById(req.params.userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const accessToken = signAccessToken(user._id);
        const refreshToken = signRefreshToken(user._id);

        user.refreshToken = await bcrypt.hash(refreshToken, 10);
        await user.save({ validateBeforeSave: false });

        return res.status(200).json({ user, accessToken, refreshToken });
    } catch (err) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

// ─── password ────────────────────────────────────────────────────────────────

export async function handleForgotPassword(req, res) {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        user.passwordResetToken = resetToken;
        user.passwordResetExpires = Date.now() + 3600000;
        await user.save({ validateBeforeSave: false });

        const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;

        const transporter = createTransport({
            service: 'gmail',
            auth: { user: process.env.USER, pass: process.env.APP_PASSWORD },
        });

        transporter.sendMail({
            from: process.env.USER,
            to: user.email,
            subject: 'Reset Password',
            text: resetUrl,
        }, (error, info) => {
            if (error) console.error('Error sending email:', error);
            else console.log('Email sent:', info.response);
        });

        res.status(200).json({ message: 'Password reset email sent successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export async function ResetPassword(req, res) {
    try {
        const { email, resetToken, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!user.passwordResetToken || user.passwordResetToken !== resetToken) {
            return res.status(400).json({ message: 'Invalid reset token' });
        }

        if (user.passwordResetExpires && user.passwordResetExpires < Date.now()) {
            return res.status(400).json({ message: 'Reset token expired' });
        }

        user.password = password;
        user.passwordResetToken = null;
        user.passwordResetExpires = null;
        user.refreshToken = null; // invalidate all sessions after password reset
        await user.save();

        return res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
}
