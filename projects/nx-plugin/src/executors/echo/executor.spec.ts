/* eslint-disable @typescript-eslint/no-explicit-any */
import { EchoExecutorSchema } from './schema';

import executor from './executor';

const options: EchoExecutorSchema = {
  textToEcho: 'Hello World!',
};

describe('Echo Executor', () => {
  it('can run', async () => {
    const output = await executor(options, {} as any);
    expect(output.success).toBe(true);
  });
});
