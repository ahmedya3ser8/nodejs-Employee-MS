import express from 'express';

import protect from '../middlewares/auth.middleware';
import { 
  clockInOut, 
  getAttendance, 
  getAttendanceStats
} from '../controllers/attendance.controller';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getAttendance)
  .post(clockInOut)

router.get('/stats', getAttendanceStats)

export default router;
