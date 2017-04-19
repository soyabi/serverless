'use strict';

const path = require('path');
const BbPromise = require('bluebird');
const _ = require('lodash');

module.exports = {
  extendedValidate() {
    // Restore state
    const serviceStateFileName = this.provider.naming.getServiceStateFileName();
    const serviceStateFilePath = path.join(this.serverless.config.servicePath,
      '.serverless',
      serviceStateFileName);
    if (!this.serverless.utils.fileExistsSync(serviceStateFilePath)) {
      throw new this.serverless.classes
        .Error(`No ${serviceStateFileName} file found in the package path you provided.`);
    }
    const state = this.serverless
      .utils.readFileSync(serviceStateFilePath);
    _.assign(this.serverless.service, state.service);
    this.serverless.service.package.artifactDirectoryName = state.package.artifactDirectoryName;

    if (this.serverless.service.package.individually) {
      // artifact file validation (multiple function artifacts)
      this.serverless.service.getAllFunctions().forEach(functionName => {
        const artifactFileName = this.provider.naming.getFunctionArtifactName(functionName);
        const artifactFilePath = path.join(this.packagePath, artifactFileName);
        if (!this.serverless.utils.fileExistsSync(artifactFilePath)) {
          throw new this.serverless.classes
            .Error(`No ${artifactFileName} file found in the package path you provided.`);
        }
      });
    } else {
      // artifact file validation (single service artifact)
      const artifactFileName = this.provider.naming.getServiceArtifactName();
      const artifactFilePath = path.join(this.packagePath, artifactFileName);
      if (!this.serverless.utils.fileExistsSync(artifactFilePath)) {
        throw new this.serverless.classes
          .Error(`No ${artifactFileName} file found in the package path you provided.`);
      }
    }

    return BbPromise.resolve();
  },
};
