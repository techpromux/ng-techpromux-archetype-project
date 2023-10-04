/* eslint-disable @typescript-eslint/no-unused-vars */
import { EchoExecutorSchema } from './schema';

import type { ExecutorContext } from '@nx/devkit';
import { exec } from 'child_process';
import { promisify } from 'util';

export default async function runExecutor(
  options: EchoExecutorSchema,
  context: ExecutorContext
): Promise<{ success: boolean }> {
  console.info(`--------------------------------------------------------`);
  console.info(`Executing "echo"...`);
  console.info(`--------------------------------------------------------`);
  console.info(`Options: ${JSON.stringify(options, null, 2)}`);
  console.info(`--------------------------------------------------------`);

  const { stdout, stderr } = await promisify(exec)(
    `echo ${options.textToEcho}`
  );
  console.log(stdout);
  console.error(stderr);
  console.info(`--------------------------------------------------------`);
  const success = !stderr;
  return { success };
}
