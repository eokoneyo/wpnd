import fs from 'fs/promises';
import { constants as FSConstants } from 'fs'
import path from 'path';
import execa from 'execa';
import chalk from "chalk";
import inquirer from 'inquirer';
import { Command } from 'commander';

const program = new Command();

const defaultConfigFile = 'wpnd.config.js';
const defaultConfigOptions = {
    // cannot leave project directory
    distDir: '.wpnd',
    port: '8085',
};

void (async () => {
    const pkg = JSON.parse(await fs.readFile(path.resolve(__dirname, '../package.json'), { encoding: 'utf-8' }));

    program
        .name('wpnd')
        .description('A CLI util for provision local wordpress dev environment')
        .version(pkg.version)
        .showSuggestionAfterError();
})();

const extractValuesFromConfigFile = async (userValue) => {
    let configFilePathProvided = userValue || defaultConfigFile;

    if (configFilePathProvided && !/^\//.test(configFilePathProvided)) {
        configFilePathProvided = path.join(process.cwd(), configFilePathProvided);
    }

    try {
        await fs.access(configFilePathProvided, FSConstants.R_OK);
        let parsedConfig = {};
        if(/.json$/.test(configFilePathProvided)) {
            parsedConfig = JSON.parse(await fs.readFile(configFilePathProvided, { encoding: 'utf-8' }));
        } else if (!/.js$/.test(configFilePathProvided)) {
            throw new Error('Unsupported config file extension')
        }

        parsedConfig = require(configFilePathProvided)

        return {
            ...defaultConfigOptions,
            ...parsedConfig
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
    .option('-c,--config <file>', 'path to config file')
    .action(async (options) => {
        const _options = {
            ...options,
            config: await extractValuesFromConfigFile(options.config)
        }

        const runner = execa(
            'docker-compose',
            [
                [ '--project-name', _options.config.name],
                [ '--file', path.join(process.cwd(), _options.config.distDir, 'stack.yml')],
                'up'
            ].flat(),
            {
                env: {
                    'WPND_IMAGE_NAME' : _options.config.name,
                    'WPND_IMAGE_PORT' : _options.config.port,
                }
            }
        )

        runner.stdout.pipe(process.stdout)
        runner.stderr.pipe(process.stdout)
    });

//TODO: allow users to spin a disposable wordpress instance
// program
//     .command('disposable')
//     .description('Starts a disposable development environment')
//     .option('-c,--config <file>', 'path to config file')
//     .action(() => {
//         //TODO: add command that will run for disposable
//     });

export async function cli (args) {
    await program.parseAsync(args)
}
