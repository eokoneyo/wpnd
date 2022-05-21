import fs from 'fs/promises';
import {constants as FSConstants} from 'fs'
import path from 'path';
import cpy from 'cpy';
import {execa} from 'execa';
import chalk from 'chalk';
import {Command} from 'commander';

const program = new Command();

const defaultConfigFile = 'wpnd.config.json';

const defaultConfigOptions = {
    // cannot leave project directory
    distDir: '.wpnd',
    port: '8085',
    removeDefaultWPThemes: false
};

const pkg = JSON.parse(await fs.readFile(path.resolve(process.cwd(), './package.json'), {encoding: 'utf-8'}));

program
    .name('wpnd')
    .description('A CLI util for provision local wordpress dev environment')
    .version(pkg.version)
    .configureOutput({
        outputError(str, write) {
            return write(chalk.red.bold(str))
        }
    })
    .showSuggestionAfterError();

const extractValuesFromConfigFile = async (userValue) => {
    let configFilePathProvided = userValue || defaultConfigFile;

    if (configFilePathProvided && !/^\//.test(configFilePathProvided)) {
        configFilePathProvided = path.join(process.cwd(), configFilePathProvided);
    }

    if (!/.json$/.test(configFilePathProvided)) {
        console.log('%s Specified Unsupported config file extension', chalk.red.bold('ERROR'));
        process.exit(1)
    }

    try {
        await fs.access(configFilePathProvided, FSConstants.R_OK);
    } catch {
        console.log('%s unable to find config file at path specified', chalk.red.bold('ERROR'));
        process.exit(1);
    }

    const parsedConfig = JSON.parse(await fs.readFile(configFilePathProvided, {encoding: 'utf-8'}));

    return {
        ...defaultConfigOptions,
        ...parsedConfig
    };
}

program
    .command('start')
    .description('Starts a project development environment')
    .option('-c,--config <file>', 'path to config file')
    .action(async (options) => {
        const _options = {
            ...options,
            config: await extractValuesFromConfigFile(options.config)
        }

        await cpy('src/templates/*', _options.config.distDir);

        const runner = execa(
            'docker-compose',
            [
                ['--project-name', _options.config.name],
                ['--file', path.join(process.cwd(), _options.config.distDir, 'stack.yml')],
                'up'
            ].flat(),
            {
                env: {
                    'WPND_IMAGE_NAME': _options.config.name,
                    'WPND_IMAGE_PORT': _options.config.port,
                    'WPND_REMOVE_DEFAULT_WP_THEMES': _options.config.removeDefaultWPThemes
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

async function cli(args) {
    await program.parseAsync(args)
}

export default cli
