## WPND

WPND is a command line tool that provisions a working local WordPress development setup using nodejs and docker (with experimental support for podman).
There's an expectation that NodeJS and your container engine of choice is also pre-installed.

A quick test dev environment using config defaults can be spun off leveraging npx by running the following command;

```bash
npx --package=wpnd@latest wpnd start
```
