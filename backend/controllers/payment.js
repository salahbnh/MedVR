import axios from "axios";
import User from '../models/user.js';

const FLOUCI_APP_TOKEN = "1f3df5ca-bc2b-4795-b792-272e912b64a4";

export async function Add(req, res) {
    const { amount, doctorId } = req.body;

    if (!amount || !doctorId) {
        return res.status(400).json({ error: 'amount and doctorId are required' });
    }

    try {
        const doctor = await User.findOne({ _id: doctorId, role: 'doctor' });
        if (!doctor) {
            return res.status(404).json({ error: 'Doctor not found' });
        }

        const payload = {
            app_token: FLOUCI_APP_TOKEN,
            app_secret: process.env.FLOUCI_TOKEN,
            accept_card: "true",
            amount: amount,
            success_link: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/success`,
            fail_link: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/fail`,
            session_timeout_secs: 1200,
            developer_tracking_id: "44627b47-18d3-4af8-9391-9138010b0fdb"
        };

        const response = await axios.post(
            "https://developers.flouci.com/api/generate_payment",
            payload,
            { headers: { 'Content-Type': 'application/json' } }
        );

        return res.status(201).json(response.data);
    } catch (error) {
        console.error('Error initiating payment:', error.response?.data || error.message);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

export async function Verify(req, res) {
    const { id } = req.params;
    const { doctorId, amount } = req.body;

    try {
        const response = await axios.get(
            `https://developers.flouci.com/api/verify_payment/${id}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'apppublic': FLOUCI_APP_TOKEN,
                    'appsecret': process.env.FLOUCI_TOKEN
                }
            }
        );

        // only update the doctor wallet after confirmed payment success
        if (response.data?.result === 'SUCCESS' && doctorId && amount) {
            const updatedDoctor = await User.findOneAndUpdate(
                { _id: doctorId, role: 'doctor' },
                { $inc: { wallet: amount } },
                { new: true }
            );
            if (!updatedDoctor) {
                console.error('Payment verified but doctor not found for wallet update:', doctorId);
            }
        }

        return res.status(200).json(response.data);
    } catch (error) {
        console.error('Error verifying payment:', error.response?.data || error.message);
        return res.status(500).json({ error: error.message });
    }
}
