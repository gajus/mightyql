import test from 'ava';
import {
  createPool,
} from '../../../src/factories/createPool';

test('pools can be extended', (t) => {
  const prodPool = createPool('', {
    idleInTransactionSessionTimeout: 'DISABLE_TIMEOUT',
    idleTimeout: 5000,
  });

  const testPool = createPool('', {
    ...prodPool.configuration,
    idleTimeout: 1000,
  });

  t.is(prodPool.configuration.idleInTransactionSessionTimeout, 'DISABLE_TIMEOUT');
  t.is(testPool.configuration.idleInTransactionSessionTimeout, 'DISABLE_TIMEOUT');

  t.is(prodPool.configuration.idleTimeout, 5000);
  t.is(testPool.configuration.idleTimeout, 1000);
});
