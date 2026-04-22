import express from 'express';

import { 
  createEmployee, 
  deleteEmployee, 
  getEmployee, 
  getEmployees, 
  updateEmployee 
} from '../controllers/employee.controller';
import { 
  createEmployeeValidator, 
  deleteEmployeeValidator, 
  getEmployeeValidator, 
  updateEmployeeValidator 
} from '../validations/employee.validator';
import protect from '../middlewares/auth.middleware';
import authorizeRoles from '../middlewares/role.middleware';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(authorizeRoles('admin', 'employee'), getEmployees)
  .post(authorizeRoles('admin'), createEmployeeValidator, createEmployee)

router.route('/:id')
  .get(authorizeRoles('admin'), getEmployeeValidator, getEmployee)
  .patch(authorizeRoles('admin'), updateEmployeeValidator, updateEmployee)
  .delete(authorizeRoles('admin'), deleteEmployeeValidator, deleteEmployee)

export default router;
