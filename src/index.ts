import { program } from 'commander';
import { download } from './commands/download';
import { login } from './commands/login';
import * as packageJson from '../package.json';

/**
 * Set global CLI configurations
 */
program.storeOptionsAsProperties(false);

program.version(packageJson.version, '-v, --version', 'output the current version');

program.command('login').description('Log in to photoslibrary.google.com').action(login);

program.command('download').description('download from google photos to image and video files').action(download);

program.parse(process.argv);
