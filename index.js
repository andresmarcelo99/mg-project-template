#!/usr/bin/env node

import chalk from "chalk";
import { createSpinner } from "nanospinner";
import inquirer from "inquirer";
import shell from "shelljs";

console.clear();

const sleep = (ms = 2000) => new Promise((r) => setTimeout(r, ms));

async function welcome() {
  console.log(`
    ${chalk.magenta("Welcome!!!")} 
    In this cli you can select a project template...
    Type ${chalk.cyan("react")} to create react template or
    ${chalk.red("nest")} for nest template
  `);
}

async function handleAnswer(template, project_name) {
  const spinner = createSpinner("Creating project...\n").start();
  await sleep();
  try {
    let repoUrl = "";
    shell.mkdir(project_name);
    shell.cd(project_name);
    if (template === "React") {
      repoUrl = "https://gitlab.com/marcelo.garcia0/react-typescript.git";
    } else {
      repoUrl = "https://gitlab.com/marcelo.garcia0/nestjs-cqrs.git";
    }
    shell.exec(`git clone ${repoUrl} .`);
    shell.rm("-rf", [".git"]);
    spinner.success({
      text: `${chalk[`${template === "React" ? "cyan" : "red"}`](
        template
      )} project generated!`,
    });
    process.exit(0);
  } catch (error) {
    spinner.error({
      text: `💀💀💀 Something went wrong when creating the project`,
    });
    process.exit(1);
  }
}

async function askTemplate() {
  const question1 = await inquirer.prompt({
    name: "template_name",
    type: "input",
    message: "Template name:",
    default() {
      return "Template";
    },
  });
  const question2 = await inquirer.prompt({
    name: "project_name",
    type: "input",
    message: "Project name:",
    default() {
      return "Project";
    },
  });
  const name = handleUserInput(question1.template_name);
  console.clear();
  handleAnswer(name, question2.project_name);
}

function handleUserInput(userInput) {
  if (userInput === "react" || userInput === "nest") {
    return userInput[0].toUpperCase() + userInput.slice(1);
  } else {
    throw new Error("");
  }
}

await welcome();
await askTemplate();
