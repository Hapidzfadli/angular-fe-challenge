import { Employee } from '../shared/models';

const firstNames = [
  'John', 'Jane', 'Michael', 'Emily', 'David', 'Sarah', 'Robert', 'Lisa',
  'William', 'Jessica', 'James', 'Jennifer', 'Daniel', 'Amanda', 'Christopher',
  'Ashley', 'Matthew', 'Stephanie', 'Andrew', 'Nicole', 'Joshua', 'Elizabeth',
  'Joseph', 'Megan', 'Anthony', 'Lauren', 'Brian', 'Samantha', 'Kevin', 'Rachel'
];

const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
  'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson',
  'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson',
  'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson'
];

const groups = [
  'Engineering', 'Human Resources', 'Finance', 'Marketing', 'Operations',
  'Sales', 'Customer Support', 'Legal', 'IT Infrastructure', 'Product Management'
];

const statuses = ['Active', 'Inactive', 'Pending'];

const descriptions = [
  'Experienced professional with strong analytical skills',
  'Team player with excellent communication abilities',
  'Detail-oriented individual with problem-solving expertise',
  'Creative thinker with innovative approach to challenges',
  'Results-driven professional with leadership qualities',
  'Dedicated worker with strong work ethic',
  'Collaborative team member with technical expertise',
  'Strategic thinker with business acumen',
  'Customer-focused professional with service excellence',
  'Motivated individual with continuous learning mindset'
];

function generateRandomDate(startYear: number, endYear: number): Date {
  const start = new Date(startYear, 0, 1);
  const end = new Date(endYear, 11, 31);
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function generateRandomSalary(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min) * 100000;
}

function generateEmployees(count: number): Employee[] {
  const employees: Employee[] = [];

  for (let i = 1; i <= count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const username = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}`;

    employees.push({
      id: i.toString(),
      username: username,
      firstName: firstName,
      lastName: lastName,
      email: `${username}@company.com`,
      birthDate: generateRandomDate(2000, 2025),
      basicSalary: generateRandomSalary(50, 200),
      status: statuses[Math.floor(Math.random() * statuses.length)],
      group: groups[Math.floor(Math.random() * groups.length)],
      description: descriptions[Math.floor(Math.random() * descriptions.length)]
    });
  }

  return employees;
}

export const EMPLOYEES_DATA: Employee[] = generateEmployees(120);
