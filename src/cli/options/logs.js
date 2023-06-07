import { Option } from 'commander';

const showLogs = new Option('-v, --verbose', 'show docker logs').default(false);

export default showLogs;
