# WPND

WPND is a command line tool that provisions a working local WordPress development setup using nodejs and docker (so essentially both tools need to be installed), from there on that's 
about it. the only configuration you need do pertains to WPND.

# Usage

WPND expects a `theme` and `plugin` folder, to host the said theme or plugin you might be creating as a developer, contained in a directory you should place in the project's root. 
you can either use the WPND helper likeso;

```bash
   npx wpnd start
```
or

```bash
   yarn dlx wpnd start
```

and that should provision a working WordPress environment. You might further make customizations by specifying a config file, or checkout the [playground](https://github.com/eokoneyo/wpnd/tree/main/playground) here for ideas on structuring your project.

# Config Files

WPND currently supports a `wpnd.config.json` file. They are usually expected to be in the current working directory.
An alternative path to the config file might could be provided with `--config <file>` option.

### Config Options

| Property                    | Description                                                                                                                                                                                                            | Type      | Default     |
|-----------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------|-------------|
| name                        | Name of container that will be created for project                                                                                                                                                                     | `string`  |             |
| distDir                     | Name of custom directory where artifact required for wpnd will be stored                                                                                                                                               | `string`  | .wpnd       |
| srcDir                      | Name of directory contain the theme/plugins we intend to develop                                                                                                                                                       | `string`  | src         |
| environment.port            | value at which the wordpress installation should be available at                                                                                                                                                       | `string`  | 8085        |
| environment.db.name         | specifies the name of the database to use, if it doesn't exist it will be created                                                                                                                                      | `string`  | exampledb   |
| environment.db.user         | specifies the user that should be attached to said database                                                                                                                                                            | `string`  | exampleuser |
| environment.db.password     | provides the password to the database in question                                                                                                                                                                      | `string`  | examplepass |
| environment.skipDockerCheck | When enabled, a check is performed to ensure the user actually has docker                                                                                                                                              | `boolean` | false       |
| environment.rebuildOnStart  | Determines if the docker image in use should be rebuilt on every start                                                                                                                                                 | `boolean` | false       |
| wpackagist                  | Specify themes or plugins from [wpackagist](https://wpackagist.org/) to be bundled by default in the provision environment, <br/> config follows the same definition that would be specified in a composer config file | `object`  | {}          |
