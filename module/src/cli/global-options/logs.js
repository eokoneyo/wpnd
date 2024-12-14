import { Option } from 'commander';

const showLogs = new Option(
  '-v, --verbose',
  'show container engine logs'
).default(false);

export default showLogs;
