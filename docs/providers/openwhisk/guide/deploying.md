<!--
title: Serverless Framework - Apache OpenWhisk Guide - Deploying
menuText: Deploying
menuOrder: 8
description: How to deploy your Apache OpenWhisk functions and their required infrastructure
layout: Doc
-->

<!-- DOCS-SITE-LINK:START automatically generated  -->
### [Read this on the main serverless docs site](https://www.serverless.com/framework/docs/providers/openwhisk/guide/deploying)
<!-- DOCS-SITE-LINK:END -->

# Deploying

The Serverless Framework was designed to provision your Apache OpenWhisk Functions, Triggers and Rules safely and quickly.  It does this via a couple of methods designed for different types of deployments.

## Deploy All

This is the main method for doing deployments with the Serverless Framework:

```bash
serverless deploy
```

Use this method when you have updated your Function, Event or Resource configuration in `serverless.yml` and you want to deploy that change (or multiple changes at the same time) to Apache OpenWhisk.

### How It Works

The Serverless Framework translates all syntax in `serverless.yml` to [platform API](http://petstore.swagger.io/?url=https://raw.githubusercontent.com/openwhisk/openwhisk/master/core/controller/src/main/resources/whiskswagger.json) calls to provision your Actions, Triggers, Rules and APIs. 

* Provider plugin parses `serverless.yml` configuration and translates to OpenWhisk resources.
* The code of your Functions is then packaged into zip files.
* Resources are deployed in the following order: *Functions, Function Sequences, API Routes, Triggers, Feeds, Rules.*
* Resources stages are deployed sequentially due to potential dependencies between the stages. 
* Resources within a stage are deployed in parallel.
* Stages without any resources defined will be skipped.

### Tips

* Use this in your CI/CD systems, as it is the safest method of deployment.
* Apache OpenWhisk has a [maximum action artifact](https://github.com/openwhisk/openwhisk/blob/master/docs/reference.md#per-action-artifact-mb-fixed-48mb) size of 48MB. This might be an issue if you are using lots of NPM packages. JavaScript build tools like webpack can help to minify your code and save space.

Check out the [deploy command docs](../cli-reference/deploy.md) for all details and options.

## Deploy Function

This deployment method updates a single function. It performs the platform API call to deploy your package without the other resources. It is much faster than redeploying your whole service each time.

```bash
serverless deploy function --function myFunction
```

### How It Works

* The Framework packages up the targeted Apache OpenWhisk Action into a zip file.
* That zip file is deployed to Apache OpenWhisk using the platform API.

### Tips

* Use this when you are developing and want to test on Apache OpenWhisk because it's much faster.
* During development, people will often run this command several times, as opposed to `serverless deploy` which is only run when larger infrastructure provisioning is required.

Check out the [deploy command docs](../cli-reference/deploy.md) for all details and options.
