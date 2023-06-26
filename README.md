# WPND

WPND is a command line tool that provisions a working local WordPress development setup using nodejs and docker (with experimental support for podman). 
There's an expectation that NodeJS and your container engine of choice is also pre-installed.

A quick test dev environment using config defaults can be spun off leveraging npx by running the following command;

```bash
npx -y --package=wpnd@latest wpnd start
```

# Usage

WPND itself is packaged as a NodeJS package, whilst it can be used as a globally installed package,
but it's probably better to use it as local installed package so switching versions is easy and your project experience
is consistent across machines.

Ideally WPND expects a src directory that mirrors the directory structure for `wp-content`, the only difference here is
said src directory would only contain the functionality being prototyped. So, for example when creating a theme, a theme directory is 
created in the specified project src directory.

One might then provision an environment for the project, by running the start command wpnd provides. it's also possible 
to make customizations to the provisioned environment and inform wpnd of deviations from the default project structure expectations
by specifying a config file. Checkout the [playground](https://github.com/eokoneyo/wpnd/tree/main/playground) here for ideas on structuring your project.

# Config Files

WPND currently supports a `wpnd.config.json` file. It is expected to be in the project working directory, 
adjacent to the project src directory. An alternative path to the config file might could be provided with `--config <file>` option.

### Config Options

| Property                    | Description                                                                                                                                                                                                            | Type      | Default     |
|-----------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------|-------------|
| name                        | Name of container that will be created for project                                                                                                                                                                     | `string`  |             |
| distDir                     | Name of custom directory where artifact required for wpnd will be stored                                                                                                                                               | `string`  | .wpnd       |
| srcDir                      | Name of directory contain the theme/plugins we intend to develop                                                                                                                                                       | `string`  | src         |
| engine                      | Container engine to use to provision environment                                                                                                                                                                       | `string`  | docker      |
| environment.port            | value at which the wordpress installation should be available at                                                                                                                                                       | `string`  | 8085        |
| environment.db.name         | specifies the name of the database to use, if it doesn't exist it will be created                                                                                                                                      | `string`  | exampledb   |
| environment.db.user         | specifies the user that should be attached to said database                                                                                                                                                            | `string`  | exampleuser |
| environment.db.password     | provides the password to the database in question                                                                                                                                                                      | `string`  | examplepass |
| environment.skipDockerCheck | When enabled, a check is performed to ensure the user actually has docker                                                                                                                                              | `boolean` | false       |
| environment.rebuildOnStart  | Determines if the docker image in use should be rebuilt on every start                                                                                                                                                 | `boolean` | false       |
| wpackagist                  | Specify themes or plugins from [wpackagist](https://wpackagist.org/) to be bundled by default in the provision environment, <br/> config follows the same definition that would be specified in a composer config file | `object`  | {}          |


### Troubleshooting
https://code.visualstudio.com/docs/editor/command-line#_code-is-not-recognized-as-an-internal-or-external-command

issues start podman machine
https://github.com/containers/podman/issues/17403
