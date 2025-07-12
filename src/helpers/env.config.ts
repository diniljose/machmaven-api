
// src/helpers/app-info.ts
import * as pkg from '../../package.json';  // <-- this loads package.json

export const AppInfo = {
  name: pkg.name,
  version: pkg.version,
  fullName: `${pkg.name}-${pkg.version}`,
};


export enum Envconfig {
    dev = '.env.dev',
    test = '.env.test',
    prod = '.env.prod',
  }
  
  

  export function getEnvFilePath(): string {
    switch (process.env.NODE_ENV) {
      case 'prod': return Envconfig.prod;
      case 'test': return Envconfig.test;
      case 'dev':
      default: return Envconfig.dev;
    }
  }
  