'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');
const path = require('path');
const AwsPackage = require('../index');
const Serverless = require('../../../../Serverless');
const AwsProvider = require('../../provider/awsProvider');

describe('#saveServiceState()', () => {
  let serverless;
  let awsPackage;
  let getServiceStateFileNameStub;
  let writeFileSyncStub;

  beforeEach(() => {
    serverless = new Serverless();
    serverless.setProvider('aws', new AwsProvider(serverless));
    awsPackage = new AwsPackage(serverless, {});
    serverless.config.servicePath = 'my-service';
    serverless.service = {
      provider: {
        compiledCloudFormationTemplate: 'compiled content',
      },
      package: {
        individually: false,
        artifactDirectoryName: 'artifact-directory',
      },
    };
    getServiceStateFileNameStub = sinon
      .stub(awsPackage.provider.naming, 'getServiceStateFileName')
      .returns('service-state.json');
    writeFileSyncStub = sinon
      .stub(awsPackage.serverless.utils, 'writeFileSync').returns();
  });

  afterEach(() => {
    awsPackage.provider.naming.getServiceStateFileName.restore();
    awsPackage.serverless.utils.writeFileSync.restore();
  });

  it('should write the service state file template to disk', () => {
    const filePath = path.join(
      awsPackage.serverless.config.servicePath,
      '.serverless',
      'service-state.json'
    );

    return awsPackage.saveServiceState().then(() => {
      const expectedStateFileContent = {
        service: {
          provider: {
            compiledCloudFormationTemplate: 'compiled content',
          },
        },
        package: {
          individually: false,
          artifactDirectoryName: 'artifact-directory',
        },
      };

      expect(getServiceStateFileNameStub.calledOnce).to.equal(true);
      expect(writeFileSyncStub.calledWithExactly(filePath, expectedStateFileContent))
        .to.equal(true);
    });
  });
});
