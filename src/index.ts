import { program } from 'commander';
import { executeDownload } from './commands/download';

/**
 * Set global CLI configurations
 */
program.storeOptionsAsProperties(false);

program.version(process.env.npm_package_version, '-v, --version', 'output the current version');

program
  .command('download')
  .description('download from google photos to image and video files')
  .action(async (source, destination): Promise<void> => {
    await executeDownload(destination);
  });
program.parse(process.argv);
