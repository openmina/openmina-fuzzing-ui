import { MinaEnv } from '@shared/types/core/environment/mina-env.type';

export const environment: Readonly<MinaEnv> = {
  production: false,
  identifier: 'Open Mina Fuzzing',
  server: 'http://localhost:1700', // this is for testing with the NodeJS server that check the files anywhere in the computer
  // server: origin + '/assets/reports', //this is for testing with files from frontend's assets folder
  parentDirectoryAbsolutePath: 'D:\\mina',
};
