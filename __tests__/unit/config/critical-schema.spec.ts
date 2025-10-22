import { getCriticalSchema } from '@/config/helpers/critical-schema';
import { CRITICAL_ENV_VARS } from '@/common/constants';
import { configValidationSchema } from '@/config/config.schema';

describe('getCriticalSchema', () => {
  it('✅ marks all critical vars as required', () => {
    const schema = getCriticalSchema();
    const keys = Object.keys(schema.describe().keys);
    expect(keys.sort()).toEqual(CRITICAL_ENV_VARS.sort());
  });

  it('✅ uses same base rules from configValidationSchema', () => {
    const criticalSchema = getCriticalSchema();
    for (const key of CRITICAL_ENV_VARS) {
      const baseRule = configValidationSchema.describe().keys[key];
      const derivedRule = criticalSchema.describe().keys[key];
      expect(derivedRule).toBeDefined();
      expect(baseRule.type).toEqual(derivedRule.type);
    }
  });
});
