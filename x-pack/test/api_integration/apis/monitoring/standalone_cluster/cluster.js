/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import expect from 'expect.js';
import clusterFixture from './fixtures/cluster';

export default function ({ getService }) {
  const supertest = getService('supertest');
  const esArchiver = getService('esArchiver');

  describe('cluster', () => {
    const archive = 'monitoring/standalone_cluster';
    const timeRange = {
      min: '2019-01-15T19:00:49.104Z',
      max: '2019-01-15T19:59:49.104Z'
    };

    before('load archive', () => {
      return esArchiver.load(archive);
    });

    after('unload archive', () => {
      return esArchiver.unload(archive);
    });

    it('should get cluster data', async () => {
      const { body } = await supertest
        .post('/api/monitoring/v1/clusters/__standalone_cluster__')
        .set('kbn-xsrf', 'xxx')
        .send({ timeRange })
        .expect(200);

      expect(body).to.eql(clusterFixture);
    });
  });
}
