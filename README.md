# WPND

⚠️ WIP

WPND is a command line tool that provisions a full working local WordPress development setup using nodejs and docker, so essentially both tools are required to be installed, from there on that's 
about it, you don't even need to have php installed, without all the hassles of doing any extra configuration to your machine, the only configuration you need do pertains to WPND.

# Usage

WPND expects a `theme` and `plugin` folder, to host the said theme or plugin you might be creating as a developer, 
you can either use the WPND helper likeso;

```bash
   npx wpnd init
```
or

```bash
   yarn dlx wpnd init
```

and you'll be prompted with a couple of questions to help config things, or you might simply create a project
npm or yarn project that has both a `theme` and `plugins` directory
with a `.wpndrc` file.

For more CLI options, use the `-h (--help)` argument

# Config Files

WPND currently supports both the `.wpndrc` and `wpnd.json` file. They are usually expected to be in current working directory.
An Alternative path to the config file might be provided with `--config <file>` option.
