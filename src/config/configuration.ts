import { getEnvVar } from '../common/utils/env.helper';
import { DEFAULT_ENV, DEFAULT_PORT } from 'src/common/constants';

export default () => ({
  nodeEnv: process.env.NODE_ENV || DEFAULT_ENV,
  port: parseInt(process.env.PORT || "" + DEFAULT_PORT, 10),

  database: {
    url: getEnvVar('DATABASE_URL'),
    shadowUrl: getEnvVar('SHADOW_DATABASE_URL'),
  },
});
