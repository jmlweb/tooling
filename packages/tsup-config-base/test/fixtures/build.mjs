import { build } from 'tsup';

const configs = JSON.parse(process.argv[2]);

for (const config of configs) {
  await build({ ...config, config: false, silent: true });
}
