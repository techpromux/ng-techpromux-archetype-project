/* eslint-disable @typescript-eslint/no-unused-vars */
import { ExtractI18nExecutorSchema } from './schema';

import type { ExecutorContext } from '@nx/devkit';
import { exec } from 'child_process';
import { promisify } from 'util';

export default async function runExecutor(
  options: ExtractI18nExecutorSchema,
  context: ExecutorContext
): Promise<{ success: boolean }> {
  console.info(`--------------------------------------------------------------------------------`);
  console.log('Executing extract-i18n task...');
  console.info(`--------------------------------------------------------------------------------`);
  console.info(`Options: ${JSON.stringify(options, null, 2)}`);
  console.info(`--------------------------------------------------------------------------------`);

  const commandOptions: ExtractI18nExecutorSchema = {
    appName: options.appName || 'app',
    sort: options.sort !== false,
    format: options.format || 'namespaced-json',
    marker: options.marker || '_i18n',
    formatIndentation: options.formatIndentation || '  ',
    langCodes: options.langCodes || ['en'],
  };

  const commands: string[] = [];

  commandOptions.langCodes.forEach((lang) => {
    const command =
      `npx ngx-translate-extract` +
      (commandOptions.sort ? ` --sort` : ``) +
      ` --format ${commandOptions.format}` +
      ` --marker ${commandOptions.marker}` +
      ` --format-indentation "${commandOptions.formatIndentation}"` +
      ` --input ./libs/${commandOptions.appName}` +
      ` --input ./code/core` +
      ` --output ./apps/${commandOptions.appName}/src/assets/i18n/${lang}.json`;

    commands.push(
      ...[
        `echo Extracting i18n for [${lang}] code...`,
        `echo --------------------------------------------------------------------------------`,
        `${command}`,
        `echo --------------------------------------------------------------------------------`,
      ]
    );
  });

  const command = commands.join(' && ');

  const { stdout, stderr } = await promisify(exec)(`${command}`);

  let outputFormatted = '';

  let flag = true;

  let count = 0;
  for (let i = 0; i < stdout.length; i++) {
    if (stdout[i] === '┐') {
      outputFormatted += stdout[i] + '\n';
    } else if (stdout[i] === '┘') {
      count = 0;
      outputFormatted += stdout[i] + '\n';
    } else if (stdout[i] === '│') {
      count++;
      flag = !flag;
      if (count === 12) outputFormatted += '  ';
      outputFormatted += stdout[i] + (flag ? '\n' : '');
    } else {
      outputFormatted += stdout[i];
    }
  }

  console.log(
    outputFormatted
    /*
    stdout
      .replace(new RegExp('┐', 'g'), '┐\n')
      .replace(new RegExp('│', 'g'), (match: string, offset: number) =>
        offset % 2 === 0 ? '│' : '│\n'
      )
    //.replace(new RegExp('││', 'g'), '│\n│')
    */
  );

  console.error(stderr);

  const success = !stderr;
  return { success };
}
