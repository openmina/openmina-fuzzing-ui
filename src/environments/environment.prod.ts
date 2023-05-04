import { MinaEnv } from '@shared/types/core/environment/mina-env.type';

export const environment: Readonly<MinaEnv> = {
  production: true,
  identifier: window['env']['identifier'] || 'Open Mina Fuzzing',
  server: window['env']['server'] || 'http://localhost:1700',
  parentDirectoryAbsolutePath: window['env']['filesAbsolutePath'] || './',
};
