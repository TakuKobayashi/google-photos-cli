import { program } from 'commander';
import { download } from './commands/download';
import { login } from './commands/login';
import { logout } from './commands/logout';
import { defaultProjectName } from './consts/project';
import * as packageJson from '../package.json';

/**
 * Set global CLI configurations
 */
program.storeOptionsAsProperties(false);

program.version(packageJson.version, '-v, --version', 'output the current version');

program.command('login').description('Log in to photoslibrary.google.com').action(login);

program
  .command('download')
  .option(
    '-p, --project <baseProjectPath>',
    `download files to this directory file path (default: ${defaultProjectName})`,
    defaultProjectName,
  )
  .description('download from google photos to image and video files')
  .action(download);

program.command('logout').description('Logout to photoslibrary.google.com').action(logout);

program.parse(process.argv);
