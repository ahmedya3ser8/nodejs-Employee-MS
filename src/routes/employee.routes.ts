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

router.use(protect, authorizeRoles('admin'));

router.route('/')
  .get(getEmployees)
  .post(createEmployeeValidator, createEmployee)

router.route('/:id')
  .get(getEmployeeValidator, getEmployee)
  .patch(updateEmployeeValidator, updateEmployee)
  .delete(deleteEmployeeValidator, deleteEmployee)

export default router;
