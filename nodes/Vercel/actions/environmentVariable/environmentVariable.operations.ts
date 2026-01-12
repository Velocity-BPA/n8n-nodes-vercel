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
} from '../../transport';

export async function create(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const projectId = this.getNodeParameter('projectId', index) as string;
  const key = this.getNodeParameter('key', index) as string;
  const value = this.getNodeParameter('value', index) as string;
  const target = this.getNodeParameter('target', index) as string[];
  const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

  const body: IDataObject = {
    key,
    value,
    target,
  };

  if (additionalFields.type) {
    body.type = additionalFields.type;
  }

  if (additionalFields.gitBranch) {
    body.gitBranch = additionalFields.gitBranch;
  }

  if (additionalFields.comment) {
    body.comment = additionalFields.comment;
  }

  const response = await vercelApiRequest.call(
    this,
    'POST',
    `/v10/projects/${projectId}/env`,
    body,
  );

  return this.helpers.returnJsonArray(response as IDataObject);
}

export async function get(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
  const projectId = this.getNodeParameter('projectId', index) as string;
  const envId = this.getNodeParameter('envId', index) as string;

  const response = await vercelApiRequest.call(
    this,
    'GET',
    `/v10/projects/${projectId}/env/${envId}`,
  );

  return this.helpers.returnJsonArray(response as IDataObject);
}

export async function getAll(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const projectId = this.getNodeParameter('projectId', index) as string;
  const returnAll = this.getNodeParameter('returnAll', index) as boolean;

  let envVars: IDataObject[];

  if (returnAll) {
    envVars = await vercelApiRequestAllItems.call(
      this,
      'GET',
      `/v10/projects/${projectId}/env`,
      'envs',
    );
  } else {
    const limit = this.getNodeParameter('limit', index) as number;
    envVars = await vercelApiRequestAllItemsWithLimit.call(
      this,
      'GET',
      `/v10/projects/${projectId}/env`,
      'envs',
      limit,
    );
  }

  return this.helpers.returnJsonArray(envVars);
}

export async function update(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const projectId = this.getNodeParameter('projectId', index) as string;
  const envId = this.getNodeParameter('envId', index) as string;
  const updateFields = this.getNodeParameter('updateFields', index, {}) as IDataObject;

  const body: IDataObject = {};

  if (updateFields.value) {
    body.value = updateFields.value;
  }

  if (updateFields.target) {
    body.target = updateFields.target;
  }

  if (updateFields.type) {
    body.type = updateFields.type;
  }

  if (updateFields.gitBranch !== undefined) {
    body.gitBranch = updateFields.gitBranch || null;
  }

  if (updateFields.comment !== undefined) {
    body.comment = updateFields.comment;
  }

  const response = await vercelApiRequest.call(
    this,
    'PATCH',
    `/v10/projects/${projectId}/env/${envId}`,
    body,
  );

  return this.helpers.returnJsonArray(response as IDataObject);
}

export async function deleteEnv(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const projectId = this.getNodeParameter('projectId', index) as string;
  const envId = this.getNodeParameter('envId', index) as string;

  await vercelApiRequest.call(this, 'DELETE', `/v10/projects/${projectId}/env/${envId}`);

  return this.helpers.returnJsonArray({ success: true, projectId, envId });
}

export async function bulkCreate(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const projectId = this.getNodeParameter('projectId', index) as string;
  const envVarsInput = this.getNodeParameter('envVars', index) as IDataObject;
  const envVarsArray = envVarsInput.envVar as IDataObject[];

  const envVars: IDataObject[] = envVarsArray.map((envVar) => ({
    key: envVar.key,
    value: envVar.value,
    target: envVar.target || ['production', 'preview', 'development'],
    type: envVar.type || 'plain',
  }));

  // The Vercel API accepts an array directly for bulk creation
  const response = await vercelApiRequest.call(
    this,
    'POST',
    `/v10/projects/${projectId}/env`,
    { envVars } as IDataObject,
  );

  return this.helpers.returnJsonArray(response as IDataObject);
}

export async function bulkDelete(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const projectId = this.getNodeParameter('projectId', index) as string;
  const envIds = this.getNodeParameter('envIds', index) as string;

  const envIdArray = envIds.split(',').map((id) => id.trim());
  const results: IDataObject[] = [];

  for (const envId of envIdArray) {
    await vercelApiRequest.call(this, 'DELETE', `/v10/projects/${projectId}/env/${envId}`);
    results.push({ success: true, envId });
  }

  return this.helpers.returnJsonArray(results);
}
