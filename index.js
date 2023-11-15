const inquirer = require('inquirer');
const express = require('express');
const mysql = require('mysql2');

const db = mysql.createConnection({
    host: "localhost", 
    user: "root",
    database: "employeeTracker_db", 
    password: "Seth122809!!",
  }),
  console.log("Connected to the employee_db database.")
);

db.connect((err) => {
  if (err) {
    console.error('Error connecting to database.', err);
    return;
  }
  console.log('Connected to the employee_db database.');
});

function init() {
  return inquirer
  .prompt([
    {
      type: 'list',
      message: 'What would you like to do?',
      name: 'startHere',
      choices: [
        'View All Employees',
        'Add Employee', 
        'Update Employee Role',
        'View All Roles', 
        'Add Role', 
        'View All Departments', 
        'Add Department', 
        'Quit'
      ],
    },
  ])
  .then((response) => {
    console.log(response);
    const { Start } = response;
    console.log(Start);
    if (Start === "View All Employees") {
      viewEmployees();
    }
    if (Start === "Add Employee") {
      addEmployee();
    }
    if (Start === "Update employee role") {
      updateEmployee();
    }
    if (Start === "View all Roles") {
      viewRoles();
    }
    if (Start === "Add Role") {
      addRole();
    }
    if (Start === "View all departments") {
      viewDepartments();
    }
    if (Start === "Add a department") {
      addDepartment();
    }
    if (Start === "Quit") {
      db.end();
    }
  });  
}

  init();
  const viewDepartments = () => {
    db.query("SELECT * FROM department", function (err, employee) {
      if (err) {
        console.log(err);
      }
      console.table(employee);
      init();
    });
  };


  const viewRoles = () => {
    db.query("SELECT * FROM role", function (err, employee) {
      if (err) {
        console.log(err);
      }
      console.table(employee);
      init();
    });
  };

  init();
  const viewEmployees = () => {
    db.query("SELECT * FROM employee", function (err, employee) {
      if (err) {
        console.log(err);
      }
      console.table(employee);
      init();
    });
  };

  init();
  const addDepartment = () => {
   inquirer
   .prompt([
    {
      type: "input",
      name: "newDepartment",
      message: "What is the name of the new department", 
    },
   ])
  .then((response) => {
    db.query(
      'INSERT INTO department (name) VALUES ("${response.newDepartment}")',
      (err, employee) => {
        if (err) {
          console.log(err);
        }
        console.log("New department added!");
        init();
        }
      };
  });
  };


  const addRole = () => {
    db.query("SELECT * FROM department", (err, employee)) => {
      if (err) {
        console.log(err);
      }
      var departments = employee.map((department) => {
        return {
          name: department.name,
          value: department.id,
        };
      });
      inquirer
      .prompt([
        {
          type: "input", 
          name: "newRole",
          message: "What is the name of the new role?",
        },
        {
          type: "input", 
          name: "salary",
          message: "What is the salary of the new role?",
        },
        {
          type: "list", 
          name: "departmentID",
          message: "What is the department of the new role?",
          choices: departments,
        },
      ])
      .then((response) => {
        db.query(
          'INSERT INTO role SET ?',
          {
            title: response.newRole,
            salary: response.salary, 
            department_id: response.departmentID,
          },
          (err, employee) => {
            if (err) {
              console.log(err);
            } else {
              console.log("New role added!");
              init();
            }
          }
        );
        });
      };
    };

    const addEmployee = () => {
      db.query("SELECT * FROM role", (err, employee) => {
        if (err) {
          console.log(err):
        }
        var roles = employee.map((role) => {
          return {
            name: role.title,
            value: role.id,
          };
          });
          inquirer
          .prompt ([
            {
              type: "input",
              name: "firstName",
              message: "What is the first name of the new employee?",
            },
            {
              type: "input",
              name: "lastName",
              message: "What is the last name of the new employee?",
            },
            {
              type: "list",
              name: "roleID",
              message: "What is the role of the new employee?",
              choices: roles,
            },
          ])
          .then((response) => {
            db.query(
              "SELECT first_name, last_name, id FROM employee",
              (err, managers) => {
                if (err) {
                  console.log(err);
                }
                const newEmployeeInfo = response;
                var managers = managers.map((managerID) => {
                  return {
                    name: managerID.first_name + " " + managerID.last_name,
                    value: managerID.id,
                  };
                });
                inquirer
                .prompt([
                  {
                    type: "list",
                    name: "managerID",
                    message: "What is the manager of the new employee?",
                    choices: managers,
                  },
                ])
                .then((response) => {
                  db.query(
                    'INSERT INTO employee SET ?',
                    {
                      first_name: newEmployeeInfo.firstName,
                      last_name: newEmployeeInfo.lastName,
                      role_id: newEmployeeInfo.roleID,
                      manager_id: response.managerID,
                    },
                    (err, employee) => {
                      if (err) {
                        console.log(err);
                      } else {
                        console.log("New employee added!");
                        init();
                      }
                    }
                };
             });
            )
               
        };
     });
   };
  };

    

      const updateEmployee = () => {
        db.query("SELECT * FROM employee", (err, employee) => {
          if (err) {
            console.log(err);
          }
          var employees = employee.map((employeeID) => {
            return {
              name: employeeID.first_name + " " + employeeID.last_name,
              value: employeeID.id,
            };
          });
          inquirer
           .prompt([
                  {
                    type: "list", 
                    name: "employeeID",
                    message: "which employee would you like to update",
                    choices: employees,
                  },
                  {
                    type: "list", 
                    name: "roleID",
                    message: "what is the employee's new role?",
                    choices: roles,
                  },
                ])
                .then((response => {
                  db.query(
                    'UPDATE employee SET role_id = $(response.roleID} WHERE id = ${response.employeeID}',
                    (err, employee) => {
                      if (err) {
                        console.log(err);
                      } else {
                        console.log("Employee role updated!");
                        init();
                      }
                    }
                  );
                });
              });
            };
          };

          init();
            

      
  