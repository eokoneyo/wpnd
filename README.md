# WPND

⚠️ WIP

WPND is a command line tool that provisions a full working local WordPress development setup using nodejs and docker, so essentially both tools are required to be installed, from there on that's 
about it, you don't even need to have php installed, without all the hassles of doing any extra configuration to your machine, the only configuration you need do pertains to WPND.

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

and that should provision a working WordPress environment. You might further make customizations by specifying a config file 

# Config Files

WPND currently supports a `wpnd.config.json` file. They are usually expected to be in the current working directory.
An Alternative path to the config file might could be provided with `--config <file>` option.
