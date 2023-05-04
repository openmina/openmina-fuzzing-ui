import { MinaEnv } from '@shared/types/core/environment/mina-env.type';

export const environment: Readonly<MinaEnv> = {
  production: false,
  identifier: 'Open Mina Fuzzing',
  server: 'http://localhost:1700',
  // server: origin + '/assets/reports',
  parentDirectoryAbsolutePath: 'D:\\mina',
};
