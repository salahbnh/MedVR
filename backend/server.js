import express from 'express';
import connectMongoDB from './lib/mongoose.js';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import userRoutes from './routes/user.js';
import renderVousRoutes from './routes/rendezVous.js';
import notificationRoutes from './routes/notification.js';
import paymentRoutes from './routes/paiement.js';
import medicalFolderRoutes from './routes/dossierMedical.js';
import availabilityRoutes from './routes/availability.js';
import http from 'http';
import { AttachIoToServer } from './socketIO.js';
import { notFoundError, errorHandler } from './middlewares/error-handler.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 9001;

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(process.env.NODE_ENV === 'production' ? morgan('combined') : morgan('dev'));
app.use(express.json());

// Rate limiting — strict on auth endpoints
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20,
    message: { error: 'Too many requests, please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
});

const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    message: { error: 'Too many requests, please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
});

app.use('/user/login', authLimiter);
app.use('/user/register', authLimiter);
app.use('/user/resetPwd', authLimiter);
app.use(generalLimiter);

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/user', userRoutes);
app.use('/rendezVous', renderVousRoutes);
app.use('/notification', notificationRoutes);
app.use('/payment', paymentRoutes);
app.use('/medical-folder', medicalFolderRoutes);
app.use('/availability', availabilityRoutes);

// Error handling
app.use(notFoundError);
app.use(errorHandler);

const server = http.createServer(app);

connectMongoDB()
    .then(() => {
        server.listen(port, () => {
            console.log(`Server running at http://localhost:${port}`);
        });
        AttachIoToServer(server);
    })
    .catch((error) => {
        console.error("Error connecting to MongoDB:", error);
    });
