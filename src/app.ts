import 'dotenv/config';
import cookieParser from 'cookie-parser';
import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';

import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import employeeRoutes from './routes/employee.routes';
import ApiError from './utils/apiError';
import globalError from './middlewares/globalError.middleware';

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:4200'
];

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) {
      cb(null, true);
    } else {
      cb(new Error('Not allowed by CORS'))
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/employees', employeeRoutes);

app.use((req: Request, res: Response, next: NextFunction) => {
  next(new ApiError(`This resource: ${req.originalUrl} is not available`, 400));
});

app.use(globalError);

export default app;
