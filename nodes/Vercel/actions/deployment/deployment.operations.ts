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
  const target = this.getNodeParameter('target', index, 'preview') as string;
  const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

  const body: IDataObject = {
    name,
    target,
  };

  if (additionalFields.projectId) {
    body.project = additionalFields.projectId;
  }

  if (additionalFields.gitSource) {
    const gitSource = additionalFields.gitSource as IDataObject;
    body.gitSource = {
      type: gitSource.type,
      ref: gitSource.ref,
      repoId: gitSource.repoId,
    };
    if (gitSource.sha) {
      (body.gitSource as IDataObject).sha = gitSource.sha;
    }
  }

  if (additionalFields.meta) {
    try {
      body.meta = JSON.parse(additionalFields.meta as string);
    } catch {
      body.meta = additionalFields.meta;
    }
  }

  if (additionalFields.regions) {
    body.regions = additionalFields.regions;
  }

  if (additionalFields.functions) {
    try {
      body.functions = JSON.parse(additionalFields.functions as string);
    } catch {
      body.functions = additionalFields.functions;
    }
  }

  if (additionalFields.routes) {
    try {
      body.routes = JSON.parse(additionalFields.routes as string);
    } catch {
      body.routes = additionalFields.routes;
    }
  }

  const response = await vercelApiRequest.call(this, 'POST', '/v13/deployments', body);

  return this.helpers.returnJsonArray(response as IDataObject);
}

export async function get(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
  const deploymentId = this.getNodeParameter('deploymentId', index) as string;
  const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

  const query = buildQueryParams({
    withGitInfo: additionalFields.withGitInfo,
  });

  const response = await vercelApiRequest.call(
    this,
    'GET',
    `/v13/deployments/${deploymentId}`,
    {},
    query,
  );

  return this.helpers.returnJsonArray(response as IDataObject);
}

export async function getAll(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const returnAll = this.getNodeParameter('returnAll', index) as boolean;
  const filters = this.getNodeParameter('filters', index, {}) as IDataObject;

  const query = buildQueryParams({
    projectId: filters.projectId,
    state: filters.state,
    target: filters.target,
    since: filters.since,
    until: filters.until,
  });

  let deployments: IDataObject[];

  if (returnAll) {
    deployments = await vercelApiRequestAllItems.call(
      this,
      'GET',
      '/v6/deployments',
      'deployments',
      {},
      query,
    );
  } else {
    const limit = this.getNodeParameter('limit', index) as number;
    deployments = await vercelApiRequestAllItemsWithLimit.call(
      this,
      'GET',
      '/v6/deployments',
      'deployments',
      limit,
      {},
      query,
    );
  }

  return this.helpers.returnJsonArray(deployments);
}

export async function deleteDeployment(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const deploymentId = this.getNodeParameter('deploymentId', index) as string;

  const response = await vercelApiRequest.call(
    this,
    'DELETE',
    `/v13/deployments/${deploymentId}`,
  );

  return this.helpers.returnJsonArray(response as IDataObject);
}

export async function getEvents(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const deploymentId = this.getNodeParameter('deploymentId', index) as string;
  const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

  const query = buildQueryParams({
    direction: additionalFields.direction || 'backward',
    follow: additionalFields.follow,
    limit: additionalFields.limit,
    name: additionalFields.name,
    since: additionalFields.since,
    until: additionalFields.until,
    statusCode: additionalFields.statusCode,
    delimiter: additionalFields.delimiter,
    builds: additionalFields.builds,
  });

  const response = await vercelApiRequest.call(
    this,
    'GET',
    `/v3/deployments/${deploymentId}/events`,
    {},
    query,
  );

  return this.helpers.returnJsonArray(response as IDataObject[]);
}

export async function getFiles(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const deploymentId = this.getNodeParameter('deploymentId', index) as string;

  const response = await vercelApiRequest.call(
    this,
    'GET',
    `/v6/deployments/${deploymentId}/files`,
  );

  return this.helpers.returnJsonArray(response as IDataObject[]);
}

export async function getFileContents(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const deploymentId = this.getNodeParameter('deploymentId', index) as string;
  const fileId = this.getNodeParameter('fileId', index) as string;

  const response = await vercelApiRequest.call(
    this,
    'GET',
    `/v7/deployments/${deploymentId}/files/${fileId}`,
  );

  return this.helpers.returnJsonArray(response as IDataObject);
}

export async function redeploy(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const deploymentId = this.getNodeParameter('deploymentId', index) as string;
  const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

  const body: IDataObject = {
    deploymentId,
  };

  if (additionalFields.name) {
    body.name = additionalFields.name;
  }

  if (additionalFields.target) {
    body.target = additionalFields.target;
  }

  if (additionalFields.meta) {
    try {
      body.meta = JSON.parse(additionalFields.meta as string);
    } catch {
      body.meta = additionalFields.meta;
    }
  }

  const response = await vercelApiRequest.call(this, 'POST', '/v13/deployments', body);

  return this.helpers.returnJsonArray(response as IDataObject);
}

export async function promote(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const projectId = this.getNodeParameter('projectId', index) as string;
  const deploymentId = this.getNodeParameter('deploymentId', index) as string;

  const body: IDataObject = {
    deploymentId,
  };

  const response = await vercelApiRequest.call(
    this,
    'POST',
    `/v10/projects/${projectId}/promote`,
    body,
  );

  return this.helpers.returnJsonArray(response as IDataObject);
}

export async function rollback(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const projectId = this.getNodeParameter('projectId', index) as string;
  const deploymentId = this.getNodeParameter('deploymentId', index) as string;

  const body: IDataObject = {
    deploymentId,
  };

  const response = await vercelApiRequest.call(
    this,
    'POST',
    `/v10/projects/${projectId}/rollback`,
    body,
  );

  return this.helpers.returnJsonArray(response as IDataObject);
}
