import { DEFAULT_ENV, DEFAULT_PORT } from 'src/common/constants';

function getEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing environment variable: ${name}`);
  return value;
}

export default () => ({
  nodeEnv: process.env.NODE_ENV || DEFAULT_ENV,
  port: parseInt(process.env.PORT || "" + DEFAULT_PORT, 10),

  database: {
    url: getEnvVar('DATABASE_URL'),
    shadowUrl: getEnvVar('SHADOW_DATABASE_URL'),
  },
});
