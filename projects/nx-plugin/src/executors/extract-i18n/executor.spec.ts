/* eslint-disable @typescript-eslint/no-explicit-any */
import executor from './executor';
import { ExtractI18nExecutorSchema } from './schema';

const options: ExtractI18nExecutorSchema = {
  appName: 'app',
};

describe('ExtractI18n Executor', () => {
  it('can run', async () => {
    const output = await executor(options, {} as any);
    expect(output.success).toBe(true);
  });
});
