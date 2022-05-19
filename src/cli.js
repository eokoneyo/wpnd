import fs from 'fs/promises';
import { constants as FSConstants } from 'fs'
import path from 'path';
import chalk from "chalk";
import inquirer from 'inquirer';
import { Command } from 'commander';

const program = new Command();
const defaultConfigOptions = {};
const supportedConfigFileFileFormat = ['.wpndrc', 'wpnd.config.js', 'wpnd.config.json'];

void (async () => {
    const pkg = JSON.parse(await fs.readFile(path.resolve(__dirname, '../package.json'), { encoding: 'utf-8' }));

    program
        .name('wpnd')
        .description('A CLI util for provision local wordpress dev environment')
        .version(pkg.version)
        .showSuggestionAfterError();
})();

const extractValuesFromConfigFile = async (value) => {
    let configFilePathProvided = value

    if (value && !/^\//.test(value)) {
        configFilePathProvided = path.join(process.cwd(), value);
    }

    try {
        await fs.access(configFilePathProvided, FSConstants.R_OK);
        const config = JSON.parse(await fs.readFile(configFilePathProvided, { encoding: 'utf-8' }));

        return {
            ...defaultConfigOptions,
            ...config
        };
    } catch {
        console.log('%s unable to find config file at path specified',  chalk.red.bold('ERROR'));
        process.exit(1);
    }
}

async function projectInit () {
    const questions = [
        {
            type: 'input',
            name: 'name',
            message: 'Project name'
        },
    ];

    const answers = await inquirer.prompt(questions);

    const config = {
        ...this.opts,
        // TODO: check output from inquirer
        ...answers
    }

    console.log('configs:: %o \n', config);

    //FIXME: forward collected options to method that will generate config file
}

async function bootstrapTemplateFiles ()  {
    const cwd = process.cwd();
    const templateDir = path.join(cwd, 'templates')

    const filesToCreate = await fs.readdir(templateDir);

    filesToCreate.forEach(file => {

    })
}

program
    .command('init')
    .description('Initialize a new project that will utilize WPND')
    .action(projectInit)

program
    .command('start')
    .description('Starts a project development environment')
    .option('-c --config <file>', 'path to config file', extractValuesFromConfigFile)
    .action(bootstrapTemplateFiles)

program
    .command('disposable')
    .description('Starts a disposable development environment')
    .option('-c --config <file>', 'path to config file', extractValuesFromConfigFile)
    .action(() => {
        //TODO: add command that will run for disposable
    })

export async function cli (args) {
    await program.parseAsync(args)
}
