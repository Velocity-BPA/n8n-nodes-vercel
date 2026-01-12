/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import {
  IDataObject,
  IExecuteFunctions,
  IHookFunctions,
  ILoadOptionsFunctions,
  IWebhookFunctions,
  NodeApiError,
  NodeOperationError,
  IHttpRequestMethods,
  IHttpRequestOptions,
  JsonObject,
} from 'n8n-workflow';

import {
  VERCEL_API_BASE_URL,
  VERCEL_MAX_PAGINATION_LIMIT,
  VERCEL_RETRY_CONFIG,
} from '../constants/constants';

export interface IVercelApiCredentials {
  accessToken: string;
  teamId?: string;
}

/**
 * Make an authenticated request to the Vercel API
 */
export async function vercelApiRequest(
  this: IExecuteFunctions | ILoadOptionsFunctions | IHookFunctions | IWebhookFunctions,
  method: IHttpRequestMethods,
  endpoint: string,
  body?: IDataObject,
  query?: IDataObject,
  option?: IDataObject,
): Promise<IDataObject | IDataObject[]> {
  const credentials = (await this.getCredentials('vercelApi')) as IVercelApiCredentials;

  const queryParams: IDataObject = { ...query };

  // Add team ID if specified in credentials
  if (credentials.teamId) {
    queryParams.teamId = credentials.teamId;
  }

  const options: IHttpRequestOptions = {
    method,
    url: `${VERCEL_API_BASE_URL}${endpoint}`,
    headers: {
      'Content-Type': 'application/json',
    },
    json: true,
  };

  if (Object.keys(queryParams).length > 0) {
    options.qs = queryParams;
  }

  if (body && Object.keys(body).length > 0) {
    options.body = body;
  }

  if (option && Object.keys(option).length > 0) {
    Object.assign(options, option);
  }

  try {
    const response = await this.helpers.httpRequestWithAuthentication.call(
      this,
      'vercelApi',
      options,
    );
    return response as IDataObject | IDataObject[];
  } catch (error) {
    // Convert error to JsonObject for NodeApiError
    const errorJson: JsonObject = {};
    if (error instanceof Error) {
      errorJson.message = error.message;
      errorJson.name = error.name;
    } else if (typeof error === 'object' && error !== null) {
      Object.assign(errorJson, JSON.parse(JSON.stringify(error)));
    }
    throw new NodeApiError(this.getNode(), errorJson, {
      message: getErrorMessage(error),
    });
  }
}

/**
 * Make an authenticated request to the Vercel API with automatic retry on rate limits
 */
export async function vercelApiRequestWithRetry(
  this: IExecuteFunctions | ILoadOptionsFunctions | IHookFunctions | IWebhookFunctions,
  method: IHttpRequestMethods,
  endpoint: string,
  body?: IDataObject,
  query?: IDataObject,
  option?: IDataObject,
): Promise<IDataObject | IDataObject[]> {
  let retries = 0;
  let delay = VERCEL_RETRY_CONFIG.INITIAL_DELAY_MS;

  while (retries < VERCEL_RETRY_CONFIG.MAX_RETRIES) {
    try {
      return await vercelApiRequest.call(this, method, endpoint, body, query, option);
    } catch (error) {
      const apiError = error as NodeApiError;
      const statusCode = apiError.httpCode;

      // Only retry on rate limit errors (429)
      if (statusCode === '429') {
        retries++;
        if (retries >= VERCEL_RETRY_CONFIG.MAX_RETRIES) {
          throw error;
        }

        // Wait with exponential backoff
        await sleep(delay);
        delay = Math.min(delay * VERCEL_RETRY_CONFIG.BACKOFF_MULTIPLIER, VERCEL_RETRY_CONFIG.MAX_DELAY_MS);
      } else {
        throw error;
      }
    }
  }

  throw new NodeOperationError(this.getNode(), 'Maximum retry attempts reached');
}

/**
 * Make paginated requests to retrieve all items from a Vercel API endpoint
 */
export async function vercelApiRequestAllItems(
  this: IExecuteFunctions | ILoadOptionsFunctions | IHookFunctions,
  method: IHttpRequestMethods,
  endpoint: string,
  propertyName: string,
  body?: IDataObject,
  query?: IDataObject,
  option?: IDataObject,
): Promise<IDataObject[]> {
  const returnData: IDataObject[] = [];

  let responseData: IDataObject;
  const queryParams: IDataObject = { ...query };
  queryParams.limit = VERCEL_MAX_PAGINATION_LIMIT;

  do {
    responseData = (await vercelApiRequest.call(
      this,
      method,
      endpoint,
      body,
      queryParams,
      option,
    )) as IDataObject;

    const items = responseData[propertyName];
    if (Array.isArray(items)) {
      returnData.push(...items);
    }

    // Handle Vercel's pagination
    const pagination = responseData.pagination as IDataObject | undefined;
    if (pagination?.next) {
      queryParams.until = pagination.next;
    } else {
      break;
    }
  } while (true);

  return returnData;
}

/**
 * Make paginated requests with a limit on total items returned
 */
export async function vercelApiRequestAllItemsWithLimit(
  this: IExecuteFunctions | ILoadOptionsFunctions | IHookFunctions,
  method: IHttpRequestMethods,
  endpoint: string,
  propertyName: string,
  limit: number,
  body?: IDataObject,
  query?: IDataObject,
  option?: IDataObject,
): Promise<IDataObject[]> {
  const returnData: IDataObject[] = [];

  let responseData: IDataObject;
  const queryParams: IDataObject = { ...query };
  queryParams.limit = Math.min(limit, VERCEL_MAX_PAGINATION_LIMIT);

  do {
    responseData = (await vercelApiRequest.call(
      this,
      method,
      endpoint,
      body,
      queryParams,
      option,
    )) as IDataObject;

    const items = responseData[propertyName];
    if (Array.isArray(items)) {
      returnData.push(...items);
    }

    // Check if we've reached the limit
    if (returnData.length >= limit) {
      return returnData.slice(0, limit);
    }

    // Handle Vercel's pagination
    const pagination = responseData.pagination as IDataObject | undefined;
    if (pagination?.next) {
      queryParams.until = pagination.next;
      queryParams.limit = Math.min(limit - returnData.length, VERCEL_MAX_PAGINATION_LIMIT);
    } else {
      break;
    }
  } while (true);

  return returnData;
}

/**
 * Extract a meaningful error message from an API error
 */
function getErrorMessage(error: unknown): string {
  // Cast to a flexible record type to access potential properties
  const errorObj = error as Record<string, unknown>;
  
  // Handle Vercel API error format
  if (errorObj.error && typeof errorObj.error === 'object') {
    const vercelError = errorObj.error as Record<string, unknown>;
    if (vercelError.message) {
      return String(vercelError.message);
    }
    if (vercelError.code) {
      return `Vercel API Error: ${String(vercelError.code)}`;
    }
  }

  // Handle standard error format
  if (errorObj.message) {
    return String(errorObj.message);
  }

  // Handle response error format
  if (errorObj.response && typeof errorObj.response === 'object') {
    const response = errorObj.response as Record<string, unknown>;
    if (response.body && typeof response.body === 'object') {
      const body = response.body as Record<string, unknown>;
      if (body.error && typeof body.error === 'object') {
        const bodyError = body.error as Record<string, unknown>;
        return String(bodyError.message || bodyError.code || 'Unknown error');
      }
    }
  }

  // Handle error code directly on error object
  if (errorObj.code) {
    return `Error code: ${String(errorObj.code)}`;
  }

  return 'An unknown error occurred';
}

/**
 * Sleep utility for rate limiting
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Build query parameters for filtering
 */
export function buildQueryParams(params: IDataObject): IDataObject {
  const query: IDataObject = {};

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== '' && value !== null) {
      query[key] = value;
    }
  }

  return query;
}

/**
 * Validate project ID or name format
 */
export function validateProjectIdentifier(identifier: string): boolean {
  // Vercel project IDs start with 'prj_' or can be project names (lowercase alphanumeric with hyphens)
  const projectIdPattern = /^prj_[a-zA-Z0-9]+$/;
  const projectNamePattern = /^[a-z0-9][a-z0-9-]*[a-z0-9]$|^[a-z0-9]$/;
  
  return projectIdPattern.test(identifier) || projectNamePattern.test(identifier);
}

/**
 * Validate team ID format
 */
export function validateTeamId(teamId: string): boolean {
  const teamIdPattern = /^team_[a-zA-Z0-9]+$/;
  return teamIdPattern.test(teamId);
}

/**
 * Validate deployment ID format
 */
export function validateDeploymentId(deploymentId: string): boolean {
  const deploymentIdPattern = /^dpl_[a-zA-Z0-9]+$/;
  return deploymentIdPattern.test(deploymentId) || /^[a-zA-Z0-9]+$/.test(deploymentId);
}

/**
 * Simplify response for n8n output
 */
export function simplifyResponse(data: IDataObject, fields?: string[]): IDataObject {
  if (!fields || fields.length === 0) {
    return data;
  }

  const simplified: IDataObject = {};
  for (const field of fields) {
    if (data[field] !== undefined) {
      simplified[field] = data[field];
    }
  }
  return simplified;
}
