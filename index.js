const inquirer = require('inquirer');
const mysql = require('mysql2');

const db = mysql.createConnection(
  {
    host: "localhost", 
    user: "root",
    database: "employeeTracker_db", 
    password: "Seth122809!!",
  },
  console.log("Connected to the employee_db database.")
);

function init() {
  return inquirer
  .prompt([
    {
      type: 'list',
      message: 'What would you like to do?',
      name: 'Start',
      choices: [
        'View All Employees',
        'Add Employee', 
        'Update Employee Role',
        'View All Roles', 
        'Add Role', 
        'View All Departments', 
        'Add Department', 
        'Quit'
      ]
    },
  ])
}
  