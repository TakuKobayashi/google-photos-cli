import { build } from 'esbuild'
import { program } from 'commander';
import glob from 'glob'
import { dependencies } from '../package.json'
import path from 'path';
const entryPoints = glob.sync('src/**/*.ts')// 適宜読み替えてください

program
  .command('exec')
  .option(
    '-w, --watch',
    `execute build with watch mode`
  )
  .action((options: any) => {
    build({
      entryPoints: entryPoints,
      bundle: true,
      outdir: path.resolve('dist'), // 出力先ディレクトリ
      platform: 'node', // 'node' 'browser' 'neutral' のいずれかを指定,
      external: Object.keys(dependencies), // バンドルに含めたくないライブラリがある場合は、パッケージ名を文字列で列挙する,
      watch: options.watch, // trueにすれば、ファイルを監視して自動で再ビルドしてくれるようになる
      logLevel: 'info',
      minify: true,
      target: ['ES6'],
      tsconfig: path.resolve('tsconfig.json'),
    })
  });
program.parse(process.argv);