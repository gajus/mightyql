// @flow

/* eslint-disable fp/no-events */

import EventEmitter from 'events';
import sinon from 'sinon';
import bindPool from '../../src/binders/bindPool';
import type {
  ClientConfigurationInputType,
} from '../../src/types';
import log from './Logger';

const defaultConfiguration = {
  interceptors: [],
  typeParsers: [],
};

export default (clientConfiguration: ClientConfigurationInputType = defaultConfiguration) => {
  const eventEmitter = new EventEmitter();

  const connection = {
    connection: {
      slonik: {
        connectionId: '1',
        mock: false,
        poolId: '1',
        transactionDepth: null,
      },
    },
    emit: eventEmitter.emit.bind(eventEmitter),
    end: () => {},
    off: eventEmitter.off.bind(eventEmitter),
    on: eventEmitter.on.bind(eventEmitter),
    query: () => {
      return {};
    },
    release: () => {},
  };

  const internalPool = {
    _pulseQueue: () => {},
    _remove: () => {},
    connect: () => {
      return connection;
    },
    slonik: {
      ended: false,
      mock: false,
      poolId: '1',
    },
  };

  const connectSpy = sinon.spy(internalPool, 'connect');
  const endSpy = sinon.spy(connection, 'end');
  const querySpy = sinon.stub(connection, 'query').returns({});
  const releaseSpy = sinon.spy(connection, 'release');
  const removeSpy = sinon.spy(internalPool, '_remove');

  const pool = bindPool(
    log,
    internalPool,

    // $FlowFixMe
    {
      // @see https://github.com/facebook/flow/issues/7505
      // $FlowFixMe
      interceptors: [],

      // $FlowFixMe
      typeParsers: [],
      ...clientConfiguration,
    },
  );

  const helpers = {
    connection,
    connectSpy,
    endSpy,
    querySpy,
    releaseSpy,
    removeSpy,
  };

  Object.keys(helpers).forEach(prop => {
    Object.defineProperty(pool, prop, { value: helpers[prop], enumerable: false });
  });
  return pool;
};
