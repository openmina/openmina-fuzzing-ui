import { MinaEnv } from '@shared/types/core/environment/mina-env.type';
import { environment } from '@environment/environment';

export const CONFIG: Readonly<MinaEnv> = {
  ...environment,
  parentDirectoryAbsolutePath: environment.parentDirectoryAbsolutePath?.replace(/\/$/, ''),
};

(window as any).config = CONFIG;
