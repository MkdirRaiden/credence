import { getEnvVar } from '../common/utils/env.helper';

export default () => ({
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '5000', 10),

  database: {
    url: getEnvVar('DATABASE_URL'),
    shadowUrl: getEnvVar('SHADOW_DATABASE_URL'),
  },
});
