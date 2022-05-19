#!/usr/bin/env node

const path = require('path');
require = require('esm')(module);
require(path.join(__dirname, '../src/cli')).cli(process.argv)
