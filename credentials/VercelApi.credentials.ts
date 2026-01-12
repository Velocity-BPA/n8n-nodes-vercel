/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import {
  IAuthenticateGeneric,
  ICredentialTestRequest,
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';

export class VercelApi implements ICredentialType {
  name = 'vercelApi';
  displayName = 'Vercel API';
  documentationUrl = 'https://vercel.com/docs/rest-api';
  properties: INodeProperties[] = [
    {
      displayName: 'Access Token',
      name: 'accessToken',
      type: 'string',
      typeOptions: {
        password: true,
      },
      default: '',
      required: true,
      description:
        'Personal Access Token from Vercel Dashboard. Navigate to Account Settings > Tokens to create one.',
    },
    {
      displayName: 'Team ID',
      name: 'teamId',
      type: 'string',
      default: '',
      required: false,
      description:
        'Team ID for team-scoped operations (format: team_xxxxxxxxxxxx). Leave empty for personal account.',
      placeholder: 'team_xxxxxxxxxxxx',
    },
  ];

  authenticate: IAuthenticateGeneric = {
    type: 'generic',
    properties: {
      headers: {
        Authorization: '=Bearer {{$credentials.accessToken}}',
      },
    },
  };

  test: ICredentialTestRequest = {
    request: {
      baseURL: 'https://api.vercel.com',
      url: '/v2/user',
    },
  };
}
