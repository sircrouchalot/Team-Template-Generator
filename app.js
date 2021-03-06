const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)

// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```
var employees = [];

var id = 1;

var questions = [
  {
    type: "list",
    message: "What role does this employee have?",
    name: "role",
    choices: ["Engineer", "Intern", "Manager"],
  },
  {
    type: "input",
    message: "What is the employee's name?",
    name: "name",
  },
  {
    type: "input",
    message: "What is the employee's email address?",
    name: "email",
  },
  {
    type: "input",
    message: "What is the intern's school?",
    name: "school",
    when: (response) => response.role === "Intern",
  },
  {
    type: "github",
    message: "What is the engineer's github username?",
    name: "github",
    when: (response) => response.role === "Engineer",
  },
  {
    type: "officeNumber",
    message: "What is the manager's office phone number?",
    name: "officeNumber",
    when: (response) => response.role === "Manager",
  },
  {
    type: "confirm",
    message: "Do you want to input another employee?",
    name: "repeat",
    default: true,
  },
];

function runInquirer(array) {
  inquirer.prompt(array).then(function (response) {
    switch(response.role) {
      case "Engineer":
        var newEngineer = new Engineer(response.name, id, response.email, response.github);
        employees.push(newEngineer);
        break;

      case "Manager":
        var newManager = new Manager(response.name, id, response.email, response.officeNumber);
        employees.push(newManager);
        break;

      case "Intern":
        var newIntern = new Intern(response.name, id, response.email, response.school);
        employees.push(newIntern);
        break;

      default:
        break;
    }

    if (response.repeat) {
      id++;
      runInquirer(questions);
    } else {
      fs.writeFile(outputPath, render(employees), (err) => {
        if (err) throw err;
        else console.log("Successfully created team page!")
      })
    }

  });
}

runInquirer(questions);