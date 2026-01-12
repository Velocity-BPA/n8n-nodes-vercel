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

export async function get(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
  const teamId = this.getNodeParameter('teamId', index) as string;

  const response = await vercelApiRequest.call(this, 'GET', `/v2/teams/${teamId}`);

  return this.helpers.returnJsonArray(response as IDataObject);
}

export async function getAll(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const returnAll = this.getNodeParameter('returnAll', index) as boolean;

  let teams: IDataObject[];

  if (returnAll) {
    teams = await vercelApiRequestAllItems.call(this, 'GET', '/v2/teams', 'teams');
  } else {
    const limit = this.getNodeParameter('limit', index) as number;
    teams = await vercelApiRequestAllItemsWithLimit.call(this, 'GET', '/v2/teams', 'teams', limit);
  }

  return this.helpers.returnJsonArray(teams);
}

export async function update(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const teamId = this.getNodeParameter('teamId', index) as string;
  const updateFields = this.getNodeParameter('updateFields', index, {}) as IDataObject;

  const body: IDataObject = {};

  if (updateFields.name) {
    body.name = updateFields.name;
  }

  if (updateFields.slug) {
    body.slug = updateFields.slug;
  }

  if (updateFields.description) {
    body.description = updateFields.description;
  }

  const response = await vercelApiRequest.call(this, 'PATCH', `/v2/teams/${teamId}`, body);

  return this.helpers.returnJsonArray(response as IDataObject);
}

export async function deleteTeam(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const teamId = this.getNodeParameter('teamId', index) as string;

  await vercelApiRequest.call(this, 'DELETE', `/v2/teams/${teamId}`);

  return this.helpers.returnJsonArray({ success: true, teamId });
}

export async function getMembers(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const teamId = this.getNodeParameter('teamId', index) as string;
  const returnAll = this.getNodeParameter('returnAll', index) as boolean;

  let members: IDataObject[];

  if (returnAll) {
    members = await vercelApiRequestAllItems.call(
      this,
      'GET',
      `/v2/teams/${teamId}/members`,
      'members',
    );
  } else {
    const limit = this.getNodeParameter('limit', index) as number;
    members = await vercelApiRequestAllItemsWithLimit.call(
      this,
      'GET',
      `/v2/teams/${teamId}/members`,
      'members',
      limit,
    );
  }

  return this.helpers.returnJsonArray(members);
}

export async function inviteMember(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const teamId = this.getNodeParameter('teamId', index) as string;
  const email = this.getNodeParameter('email', index) as string;
  const role = this.getNodeParameter('role', index) as string;
  const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

  const body: IDataObject = {
    email,
    role,
  };

  if (additionalFields.projects) {
    body.projects = (additionalFields.projects as string).split(',').map((p) => p.trim());
  }

  const response = await vercelApiRequest.call(
    this,
    'POST',
    `/v2/teams/${teamId}/members`,
    body,
  );

  return this.helpers.returnJsonArray(response as IDataObject);
}

export async function removeMember(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const teamId = this.getNodeParameter('teamId', index) as string;
  const userId = this.getNodeParameter('userId', index) as string;

  await vercelApiRequest.call(this, 'DELETE', `/v2/teams/${teamId}/members/${userId}`);

  return this.helpers.returnJsonArray({ success: true, teamId, userId });
}

export async function updateMemberRole(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const teamId = this.getNodeParameter('teamId', index) as string;
  const userId = this.getNodeParameter('userId', index) as string;
  const role = this.getNodeParameter('role', index) as string;

  const body: IDataObject = {
    role,
  };

  const response = await vercelApiRequest.call(
    this,
    'PATCH',
    `/v2/teams/${teamId}/members/${userId}`,
    body,
  );

  return this.helpers.returnJsonArray(response as IDataObject);
}

export async function getInvites(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const teamId = this.getNodeParameter('teamId', index) as string;

  const response = (await vercelApiRequest.call(
    this,
    'GET',
    `/v2/teams/${teamId}/invites`,
  )) as IDataObject;

  const invites = response.invites || response;
  return this.helpers.returnJsonArray(
    Array.isArray(invites) ? invites : [invites],
  );
}

export async function deleteInvite(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const teamId = this.getNodeParameter('teamId', index) as string;
  const inviteId = this.getNodeParameter('inviteId', index) as string;

  await vercelApiRequest.call(this, 'DELETE', `/v2/teams/${teamId}/invites/${inviteId}`);

  return this.helpers.returnJsonArray({ success: true, teamId, inviteId });
}
