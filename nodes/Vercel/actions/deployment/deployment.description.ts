/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { INodeProperties } from 'n8n-workflow';
import {
  VERCEL_DEPLOYMENT_STATES,
  VERCEL_DEPLOYMENT_TARGETS,
  VERCEL_GIT_PROVIDERS,
  VERCEL_REGIONS,
} from '../../constants/constants';

export const deploymentOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['deployment'],
      },
    },
    options: [
      {
        name: 'Create',
        value: 'create',
        description: 'Create a new deployment',
        action: 'Create a deployment',
      },
      {
        name: 'Delete',
        value: 'delete',
        description: 'Delete/cancel a deployment',
        action: 'Delete a deployment',
      },
      {
        name: 'Get',
        value: 'get',
        description: 'Get deployment details',
        action: 'Get a deployment',
      },
      {
        name: 'Get Events',
        value: 'getEvents',
        description: 'Get deployment build events/logs',
        action: 'Get deployment events',
      },
      {
        name: 'Get File Contents',
        value: 'getFileContents',
        description: 'Get contents of a specific file',
        action: 'Get file contents',
      },
      {
        name: 'Get Files',
        value: 'getFiles',
        description: 'List files in a deployment',
        action: 'Get deployment files',
      },
      {
        name: 'Get Many',
        value: 'getAll',
        description: 'Get many deployments',
        action: 'Get many deployments',
      },
      {
        name: 'Promote',
        value: 'promote',
        description: 'Promote deployment to production',
        action: 'Promote deployment',
      },
      {
        name: 'Redeploy',
        value: 'redeploy',
        description: 'Redeploy an existing deployment',
        action: 'Redeploy',
      },
      {
        name: 'Rollback',
        value: 'rollback',
        description: 'Rollback to a previous deployment',
        action: 'Rollback deployment',
      },
    ],
    default: 'getAll',
  },
];

export const deploymentFields: INodeProperties[] = [
  // Name (create)
  {
    displayName: 'Name',
    name: 'name',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['deployment'],
        operation: ['create'],
      },
    },
    default: '',
    description: 'Deployment name',
  },

  // Deployment ID
  {
    displayName: 'Deployment ID',
    name: 'deploymentId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['deployment'],
        operation: ['get', 'delete', 'getEvents', 'getFiles', 'redeploy', 'promote', 'rollback'],
      },
    },
    default: '',
    description: 'The unique deployment identifier',
  },

  // Project ID (promote, rollback)
  {
    displayName: 'Project ID or Name',
    name: 'projectId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['deployment'],
        operation: ['promote', 'rollback'],
      },
    },
    default: '',
    description: 'The project identifier',
  },

  // File ID (getFileContents)
  {
    displayName: 'File ID',
    name: 'fileId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['deployment'],
        operation: ['getFileContents'],
      },
    },
    default: '',
    description: 'The file identifier',
  },

  // Target (create)
  {
    displayName: 'Target',
    name: 'target',
    type: 'options',
    displayOptions: {
      show: {
        resource: ['deployment'],
        operation: ['create'],
      },
    },
    options: VERCEL_DEPLOYMENT_TARGETS,
    default: 'preview',
    description: 'Deployment target environment',
  },

  // Return All (getAll)
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    displayOptions: {
      show: {
        resource: ['deployment'],
        operation: ['getAll'],
      },
    },
    default: false,
    description: 'Whether to return all results or only up to a given limit',
  },

  // Limit (getAll)
  {
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    displayOptions: {
      show: {
        resource: ['deployment'],
        operation: ['getAll'],
        returnAll: [false],
      },
    },
    typeOptions: {
      minValue: 1,
      maxValue: 100,
    },
    default: 20,
    description: 'Max number of results to return',
  },

  // Filters (getAll)
  {
    displayName: 'Filters',
    name: 'filters',
    type: 'collection',
    placeholder: 'Add Filter',
    displayOptions: {
      show: {
        resource: ['deployment'],
        operation: ['getAll'],
      },
    },
    default: {},
    options: [
      {
        displayName: 'Project ID',
        name: 'projectId',
        type: 'string',
        default: '',
        description: 'Filter by project ID',
      },
      {
        displayName: 'Since',
        name: 'since',
        type: 'dateTime',
        default: '',
        description: 'Filter deployments created after this timestamp',
      },
      {
        displayName: 'State',
        name: 'state',
        type: 'options',
        options: VERCEL_DEPLOYMENT_STATES,
        default: '',
        description: 'Filter by deployment state',
      },
      {
        displayName: 'Target',
        name: 'target',
        type: 'options',
        options: VERCEL_DEPLOYMENT_TARGETS,
        default: '',
        description: 'Filter by deployment target',
      },
      {
        displayName: 'Until',
        name: 'until',
        type: 'dateTime',
        default: '',
        description: 'Filter deployments created before this timestamp',
      },
    ],
  },

  // Additional Fields (create)
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    displayOptions: {
      show: {
        resource: ['deployment'],
        operation: ['create'],
      },
    },
    default: {},
    options: [
      {
        displayName: 'Functions (JSON)',
        name: 'functions',
        type: 'json',
        default: '{}',
        description: 'Serverless function configurations as JSON',
      },
      {
        displayName: 'Git Source',
        name: 'gitSource',
        type: 'fixedCollection',
        typeOptions: {
          multipleValues: false,
        },
        default: {},
        options: [
          {
            name: 'gitSourceValues',
            displayName: 'Git Source',
            values: [
              {
                displayName: 'Type',
                name: 'type',
                type: 'options',
                options: VERCEL_GIT_PROVIDERS,
                default: 'github',
              },
              {
                displayName: 'Ref',
                name: 'ref',
                type: 'string',
                default: '',
                description: 'Git reference (branch, tag, or commit)',
              },
              {
                displayName: 'Repository ID',
                name: 'repoId',
                type: 'number',
                default: 0,
                description: 'Repository ID',
              },
              {
                displayName: 'SHA',
                name: 'sha',
                type: 'string',
                default: '',
                description: 'Commit SHA (optional)',
              },
            ],
          },
        ],
      },
      {
        displayName: 'Meta (JSON)',
        name: 'meta',
        type: 'json',
        default: '{}',
        description: 'Custom metadata as JSON',
      },
      {
        displayName: 'Project ID',
        name: 'projectId',
        type: 'string',
        default: '',
        description: 'Associated project ID',
      },
      {
        displayName: 'Regions',
        name: 'regions',
        type: 'multiOptions',
        options: VERCEL_REGIONS,
        default: [],
        description: 'Deployment regions',
      },
      {
        displayName: 'Routes (JSON)',
        name: 'routes',
        type: 'json',
        default: '[]',
        description: 'Custom routing rules as JSON array',
      },
    ],
  },

  // Additional Fields (get)
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    displayOptions: {
      show: {
        resource: ['deployment'],
        operation: ['get'],
      },
    },
    default: {},
    options: [
      {
        displayName: 'With Git Info',
        name: 'withGitInfo',
        type: 'boolean',
        default: false,
        description: 'Whether to include Git information',
      },
    ],
  },

  // Additional Fields (getEvents)
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    displayOptions: {
      show: {
        resource: ['deployment'],
        operation: ['getEvents'],
      },
    },
    default: {},
    options: [
      {
        displayName: 'Builds',
        name: 'builds',
        type: 'boolean',
        default: true,
        description: 'Whether to include build logs',
      },
      {
        displayName: 'Delimiter',
        name: 'delimiter',
        type: 'number',
        default: 1,
        description: 'Log delimiter',
      },
      {
        displayName: 'Direction',
        name: 'direction',
        type: 'options',
        options: [
          { name: 'Backward', value: 'backward' },
          { name: 'Forward', value: 'forward' },
        ],
        default: 'backward',
        description: 'Log direction',
      },
      {
        displayName: 'Follow',
        name: 'follow',
        type: 'boolean',
        default: false,
        description: 'Whether to follow log stream',
      },
      {
        displayName: 'Limit',
        name: 'limit',
        type: 'number',
        default: 100,
        description: 'Maximum number of log entries',
      },
      {
        displayName: 'Name',
        name: 'name',
        type: 'string',
        default: '',
        description: 'Filter by function name',
      },
      {
        displayName: 'Since',
        name: 'since',
        type: 'number',
        default: 0,
        description: 'Start timestamp for logs',
      },
      {
        displayName: 'Status Code',
        name: 'statusCode',
        type: 'string',
        default: '',
        description: 'Filter by HTTP status code',
      },
      {
        displayName: 'Until',
        name: 'until',
        type: 'number',
        default: 0,
        description: 'End timestamp for logs',
      },
    ],
  },

  // Additional Fields (redeploy)
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    displayOptions: {
      show: {
        resource: ['deployment'],
        operation: ['redeploy'],
      },
    },
    default: {},
    options: [
      {
        displayName: 'Meta (JSON)',
        name: 'meta',
        type: 'json',
        default: '{}',
        description: 'Custom metadata as JSON',
      },
      {
        displayName: 'Name',
        name: 'name',
        type: 'string',
        default: '',
        description: 'New deployment name',
      },
      {
        displayName: 'Target',
        name: 'target',
        type: 'options',
        options: VERCEL_DEPLOYMENT_TARGETS,
        default: 'preview',
        description: 'Deployment target',
      },
    ],
  },
];
