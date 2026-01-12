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
  const domain = this.getNodeParameter('domain', index) as string;
  const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

  const body: IDataObject = {
    name: domain,
  };

  if (additionalFields.cdnEnabled !== undefined) {
    body.cdnEnabled = additionalFields.cdnEnabled;
  }

  if (additionalFields.zone !== undefined) {
    body.zone = additionalFields.zone;
  }

  const response = await vercelApiRequest.call(this, 'POST', '/v5/domains', body);

  return this.helpers.returnJsonArray(response as IDataObject);
}

export async function get(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
  const domain = this.getNodeParameter('domain', index) as string;

  const response = await vercelApiRequest.call(this, 'GET', `/v5/domains/${domain}`);

  return this.helpers.returnJsonArray(response as IDataObject);
}

export async function getAll(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const returnAll = this.getNodeParameter('returnAll', index) as boolean;

  let domains: IDataObject[];

  if (returnAll) {
    domains = await vercelApiRequestAllItems.call(this, 'GET', '/v5/domains', 'domains');
  } else {
    const limit = this.getNodeParameter('limit', index) as number;
    domains = await vercelApiRequestAllItemsWithLimit.call(
      this,
      'GET',
      '/v5/domains',
      'domains',
      limit,
    );
  }

  return this.helpers.returnJsonArray(domains);
}

export async function deleteDomain(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const domain = this.getNodeParameter('domain', index) as string;

  const response = await vercelApiRequest.call(this, 'DELETE', `/v6/domains/${domain}`);

  return this.helpers.returnJsonArray(response as IDataObject);
}

export async function verify(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const domain = this.getNodeParameter('domain', index) as string;

  const response = await vercelApiRequest.call(this, 'POST', `/v5/domains/${domain}/verify`);

  return this.helpers.returnJsonArray(response as IDataObject);
}

export async function getConfig(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const domain = this.getNodeParameter('domain', index) as string;

  const response = await vercelApiRequest.call(this, 'GET', `/v6/domains/${domain}/config`);

  return this.helpers.returnJsonArray(response as IDataObject);
}

export async function checkAvailability(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const domain = this.getNodeParameter('domain', index) as string;

  const query = { name: domain };
  const response = await vercelApiRequest.call(this, 'GET', '/v4/domains/status', {}, query);

  return this.helpers.returnJsonArray(response as IDataObject);
}

export async function purchase(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const domain = this.getNodeParameter('domain', index) as string;
  const expectedPrice = this.getNodeParameter('expectedPrice', index) as number;

  const body: IDataObject = {
    name: domain,
    expectedPrice,
  };

  const response = await vercelApiRequest.call(this, 'POST', '/v5/domains/buy', body);

  return this.helpers.returnJsonArray(response as IDataObject);
}

export async function transferIn(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const domain = this.getNodeParameter('domain', index) as string;
  const authCode = this.getNodeParameter('authCode', index) as string;
  const expectedPrice = this.getNodeParameter('expectedPrice', index) as number;

  const body: IDataObject = {
    name: domain,
    authCode,
    expectedPrice,
  };

  const response = await vercelApiRequest.call(this, 'POST', '/v4/domains/transfer-in', body);

  return this.helpers.returnJsonArray(response as IDataObject);
}

export async function getDnsRecords(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const domain = this.getNodeParameter('domain', index) as string;
  const returnAll = this.getNodeParameter('returnAll', index) as boolean;

  let records: IDataObject[];

  if (returnAll) {
    records = await vercelApiRequestAllItems.call(
      this,
      'GET',
      `/v4/domains/${domain}/records`,
      'records',
    );
  } else {
    const limit = this.getNodeParameter('limit', index) as number;
    records = await vercelApiRequestAllItemsWithLimit.call(
      this,
      'GET',
      `/v4/domains/${domain}/records`,
      'records',
      limit,
    );
  }

  return this.helpers.returnJsonArray(records);
}

export async function createDnsRecord(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const domain = this.getNodeParameter('domain', index) as string;
  const recordType = this.getNodeParameter('recordType', index) as string;
  const name = this.getNodeParameter('name', index) as string;
  const value = this.getNodeParameter('value', index) as string;
  const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

  const body: IDataObject = {
    type: recordType,
    name,
    value,
  };

  if (additionalFields.ttl) {
    body.ttl = additionalFields.ttl;
  }

  if (additionalFields.mxPriority !== undefined) {
    body.mxPriority = additionalFields.mxPriority;
  }

  if (additionalFields.srvPriority !== undefined) {
    body.srv = {
      priority: additionalFields.srvPriority,
      weight: additionalFields.srvWeight,
      port: additionalFields.srvPort,
      target: additionalFields.srvTarget,
    };
  }

  const response = await vercelApiRequest.call(
    this,
    'POST',
    `/v4/domains/${domain}/records`,
    body,
  );

  return this.helpers.returnJsonArray(response as IDataObject);
}

export async function deleteDnsRecord(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const domain = this.getNodeParameter('domain', index) as string;
  const recordId = this.getNodeParameter('recordId', index) as string;

  await vercelApiRequest.call(this, 'DELETE', `/v2/domains/${domain}/records/${recordId}`);

  return this.helpers.returnJsonArray({ success: true, domain, recordId });
}
