import express from 'express';

import { 
  createPayslip, 
  getMyPayslips, 
  getPayslip, 
  getPayslips 
} from '../controllers/payslip.controller';
import { 
  createPayslipValidator, 
  getPayslipValidator
} from '../validations/payslip.validator';

import protect from '../middlewares/auth.middleware';
import authorizeRoles from '../middlewares/role.middleware';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(authorizeRoles('admin'), getPayslips)
  .post(createPayslipValidator, createPayslip);

router.get('/me', getMyPayslips);
router.get('/:id', getPayslipValidator, getPayslip);

export default router;
