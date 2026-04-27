import express from 'express';

import protect from '../middlewares/auth.middleware';
import authorizeRoles from '../middlewares/role.middleware';

import { 
  getAdminDashboard, 
  getEmployeeDashboard 
} from '../controllers/dashboard.controller';

const router = express.Router();

router.use(protect);

router.get('/admin', authorizeRoles('admin'), getAdminDashboard);
router.get('/employee', authorizeRoles('employee'), getEmployeeDashboard);

export default router;
