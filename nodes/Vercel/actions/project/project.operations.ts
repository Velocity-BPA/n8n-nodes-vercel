/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import {
  vercelApiRequest,
  vercelApiRequestAllItems,
  vercelApiRequestAllItemsWithLimit,
  buildQueryParams,
} from '../../transport';

export async function create(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const name = this.getNodeParameter('name', index) as string;
  const framework = this.getNodeParameter('framework', index, '') as string;
  const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

  const body: IDataObject = {
    name,
  };

  if (framework) {
    body.framework = framework;
  }

  if (additionalFields.buildCommand) {
    body.buildCommand = additionalFields.buildCommand;
  }

  if (additionalFields.devCommand) {
    body.devCommand = additionalFields.devCommand;
  }

  if (additionalFields.installCommand) {
    body.installCommand = additionalFields.installCommand;
  }

  if (additionalFields.outputDirectory) {
    body.outputDirectory = additionalFields.outputDirectory;
  }

  if (additionalFields.rootDirectory) {
    body.rootDirectory = additionalFields.rootDirectory;
  }

  if (additionalFields.nodeVersion) {
    body.nodeVersion = additionalFields.nodeVersion;
  }

  if (additionalFields.serverlessFunctionRegion) {
    body.serverlessFunctionRegion = additionalFields.serverlessFunctionRegion;
  }

  if (additionalFields.publicSource !== undefined) {
    body.publicSource = additionalFields.publicSource;
  }

  if (additionalFields.gitRepository) {
    const gitRepo = additionalFields.gitRepository as IDataObject;
    body.gitRepository = {
      type: gitRepo.type,
      repo: gitRepo.repo,
    };
  }

  const response = await vercelApiRequest.call(this, 'POST', '/v10/projects', body);

  return this.helpers.returnJsonArray(response as IDataObject);
}

export async function get(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
  const projectId = this.getNodeParameter('projectId', index) as string;

  const response = await vercelApiRequest.call(this, 'GET', `/v10/projects/${projectId}`);

  return this.helpers.returnJsonArray(response as IDataObject);
}

export async function getAll(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const returnAll = this.getNodeParameter('returnAll', index) as boolean;
  const filters = this.getNodeParameter('filters', index, {}) as IDataObject;

  const query = buildQueryParams({
    search: filters.search,
    gitForkProtection: filters.gitForkProtection,
    repoUrl: filters.repoUrl,
  });

  let projects: IDataObject[];

  if (returnAll) {
    projects = await vercelApiRequestAllItems.call(
      this,
      'GET',
      '/v10/projects',
      'projects',
      {},
      query,
    );
  } else {
    const limit = this.getNodeParameter('limit', index) as number;
    projects = await vercelApiRequestAllItemsWithLimit.call(
      this,
      'GET',
      '/v10/projects',
      'projects',
      limit,
      {},
      query,
    );
  }

  return this.helpers.returnJsonArray(projects);
}

export async function update(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const projectId = this.getNodeParameter('projectId', index) as string;
  const updateFields = this.getNodeParameter('updateFields', index, {}) as IDataObject;

  const body: IDataObject = {};

  if (updateFields.name) {
    body.name = updateFields.name;
  }

  if (updateFields.framework) {
    body.framework = updateFields.framework;
  }

  if (updateFields.buildCommand) {
    body.buildCommand = updateFields.buildCommand;
  }

  if (updateFields.devCommand) {
    body.devCommand = updateFields.devCommand;
  }

  if (updateFields.installCommand) {
    body.installCommand = updateFields.installCommand;
  }

  if (updateFields.outputDirectory) {
    body.outputDirectory = updateFields.outputDirectory;
  }

  if (updateFields.rootDirectory) {
    body.rootDirectory = updateFields.rootDirectory;
  }

  if (updateFields.nodeVersion) {
    body.nodeVersion = updateFields.nodeVersion;
  }

  if (updateFields.serverlessFunctionRegion) {
    body.serverlessFunctionRegion = updateFields.serverlessFunctionRegion;
  }

  if (updateFields.publicSource !== undefined) {
    body.publicSource = updateFields.publicSource;
  }

  if (updateFields.commandForIgnoringBuildStep) {
    body.commandForIgnoringBuildStep = updateFields.commandForIgnoringBuildStep;
  }

  if (updateFields.autoExposeSystemEnvs !== undefined) {
    body.autoExposeSystemEnvs = updateFields.autoExposeSystemEnvs;
  }

  const response = await vercelApiRequest.call(this, 'PATCH', `/v10/projects/${projectId}`, body);

  return this.helpers.returnJsonArray(response as IDataObject);
}

export async function deleteProject(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const projectId = this.getNodeParameter('projectId', index) as string;

  await vercelApiRequest.call(this, 'DELETE', `/v10/projects/${projectId}`);

  return this.helpers.returnJsonArray({ success: true, projectId });
}

export async function addDomain(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const projectId = this.getNodeParameter('projectId', index) as string;
  const domain = this.getNodeParameter('domain', index) as string;
  const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

  const body: IDataObject = {
    name: domain,
  };

  if (additionalFields.gitBranch) {
    body.gitBranch = additionalFields.gitBranch;
  }

  if (additionalFields.redirect) {
    body.redirect = additionalFields.redirect;
  }

  if (additionalFields.redirectStatusCode) {
    body.redirectStatusCode = additionalFields.redirectStatusCode;
  }

  const response = await vercelApiRequest.call(
    this,
    'POST',
    `/v10/projects/${projectId}/domains`,
    body,
  );

  return this.helpers.returnJsonArray(response as IDataObject);
}

export async function removeDomain(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const projectId = this.getNodeParameter('projectId', index) as string;
  const domain = this.getNodeParameter('domain', index) as string;

  await vercelApiRequest.call(this, 'DELETE', `/v10/projects/${projectId}/domains/${domain}`);

  return this.helpers.returnJsonArray({ success: true, projectId, domain });
}

export async function getProductionDeployment(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const projectId = this.getNodeParameter('projectId', index) as string;

  const response = (await vercelApiRequest.call(
    this,
    'GET',
    `/v10/projects/${projectId}`,
  )) as IDataObject;

  const targets = response.targets as IDataObject | undefined;
  const latestDeployments = response.latestDeployments as IDataObject[] | undefined;
  const productionDeployment = targets?.production || (latestDeployments ? latestDeployments[0] : undefined);

  if (!productionDeployment) {
    return this.helpers.returnJsonArray({ message: 'No production deployment found', projectId });
  }

  return this.helpers.returnJsonArray(productionDeployment as IDataObject);
}

export async function linkGitRepository(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const projectId = this.getNodeParameter('projectId', index) as string;
  const gitProvider = this.getNodeParameter('gitProvider', index) as string;
  const repo = this.getNodeParameter('repo', index) as string;
  const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

  const body: IDataObject = {
    type: gitProvider,
    repo,
  };

  if (additionalFields.productionBranch) {
    body.productionBranch = additionalFields.productionBranch;
  }

  if (additionalFields.sourceless !== undefined) {
    body.sourceless = additionalFields.sourceless;
  }

  const response = await vercelApiRequest.call(
    this,
    'POST',
    `/v10/projects/${projectId}/link`,
    body,
  );

  return this.helpers.returnJsonArray(response as IDataObject);
}

export async function unlinkGitRepository(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const projectId = this.getNodeParameter('projectId', index) as string;

  const response = await vercelApiRequest.call(
    this,
    'DELETE',
    `/v10/projects/${projectId}/link`,
  );

  return this.helpers.returnJsonArray(response as IDataObject);
}

export async function pauseProject(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const projectId = this.getNodeParameter('projectId', index) as string;

  const response = await vercelApiRequest.call(
    this,
    'POST',
    `/v10/projects/${projectId}/pause`,
  );

  return this.helpers.returnJsonArray(response as IDataObject);
}

export async function unpauseProject(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const projectId = this.getNodeParameter('projectId', index) as string;

  const response = await vercelApiRequest.call(
    this,
    'POST',
    `/v10/projects/${projectId}/unpause`,
  );

  return this.helpers.returnJsonArray(response as IDataObject);
}
