export const DEPARTMENTS = [
  'Engineering',
  'Human Resources',
  'Marketing',
  'Sales',
  'Finance',
  'Operations',
  'IT Support',
  'Product Management',
  'Design'
] as const;

export type Department = typeof DEPARTMENTS[number];
