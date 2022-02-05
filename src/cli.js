/**
 * mg-project-template
 * Cli for generating a react or nest project
 *test
 * @author Marcelo Garcia
 */

import { createSpinner } from "nanospinner";
import inquirer from "inquirer";
import shell from "shelljs";
import welcome from "cli-welcome";

import { description, version } from "../package.json";

export async function cli(args) {
  console.clear();

  const sleep = (ms = 2000) => new Promise((r) => setTimeout(r, ms));

  async function handleAnswer(template, project_name, start_repository) {
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

      if (start_repository) {
        shell.exec("git init");
        console.log("");
      }

      spinner.success({
        text: `${template} project generated 🎈`,
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
    const project_name_question = await inquirer.prompt({
      name: "project_name",
      type: "input",
      message: "Project name:",
      default: "New Project",
    });
    const template_type_question = await inquirer.prompt({
      name: "template_type",
      type: "list",
      message: "Please choice which project template to use:",
      choices: ["React", "Nest"],
      default: "React",
    });

    const initialize_repository_question = await inquirer.prompt({
      name: "start_repository",
      type: "confirm",
      message: "test git repository?:",
    });

    handleAnswer(
      template_type_question.template_type,
      project_name_question.project_name,
      initialize_repository_question.start_repository
    );
  }

  welcome({
    title: `mg-project-template`,
    tagLine: `by Marcelo Garcia`,
    description: description,
    version: version,
    bgColor: "#797EF6",
    color: "#000000",
    bold: true,
  });

  await askTemplate();
}
