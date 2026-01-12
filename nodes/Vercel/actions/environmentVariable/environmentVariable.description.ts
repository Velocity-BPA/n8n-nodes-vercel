/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { INodeProperties } from 'n8n-workflow';
import { VERCEL_ENV_VARIABLE_TARGETS, VERCEL_ENV_VARIABLE_TYPES } from '../../constants/constants';

export const environmentVariableOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['environmentVariable'],
      },
    },
    options: [
      {
        name: 'Bulk Create',
        value: 'bulkCreate',
        description: 'Create multiple environment variables',
        action: 'Bulk create environment variables',
      },
      {
        name: 'Bulk Delete',
        value: 'bulkDelete',
        description: 'Delete multiple environment variables',
        action: 'Bulk delete environment variables',
      },
      {
        name: 'Create',
        value: 'create',
        description: 'Create an environment variable',
        action: 'Create environment variable',
      },
      {
        name: 'Delete',
        value: 'delete',
        description: 'Delete an environment variable',
        action: 'Delete environment variable',
      },
      {
        name: 'Get',
        value: 'get',
        description: 'Get environment variable details',
        action: 'Get environment variable',
      },
      {
        name: 'Get Many',
        value: 'getAll',
        description: 'Get many environment variables',
        action: 'Get many environment variables',
      },
      {
        name: 'Update',
        value: 'update',
        description: 'Update an environment variable',
        action: 'Update environment variable',
      },
    ],
    default: 'getAll',
  },
];

export const environmentVariableFields: INodeProperties[] = [
  // Project ID
  {
    displayName: 'Project ID or Name',
    name: 'projectId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['environmentVariable'],
      },
    },
    default: '',
    description: 'The project identifier',
  },

  // Env ID (get, update, delete)
  {
    displayName: 'Environment Variable ID',
    name: 'envId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['environmentVariable'],
        operation: ['get', 'update', 'delete'],
      },
    },
    default: '',
    description: 'The environment variable ID',
  },

  // Key (create)
  {
    displayName: 'Key',
    name: 'key',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['environmentVariable'],
        operation: ['create'],
      },
    },
    default: '',
    placeholder: 'MY_ENV_VAR',
    description: 'Environment variable key',
  },

  // Value (create)
  {
    displayName: 'Value',
    name: 'value',
    type: 'string',
    typeOptions: {
      password: true,
    },
    required: true,
    displayOptions: {
      show: {
        resource: ['environmentVariable'],
        operation: ['create'],
      },
    },
    default: '',
    description: 'Environment variable value',
  },

  // Target (create)
  {
    displayName: 'Target',
    name: 'target',
    type: 'multiOptions',
    required: true,
    displayOptions: {
      show: {
        resource: ['environmentVariable'],
        operation: ['create'],
      },
    },
    options: VERCEL_ENV_VARIABLE_TARGETS,
    default: ['production', 'preview', 'development'],
    description: 'Deployment targets for this variable',
  },

  // Env IDs (bulkDelete)
  {
    displayName: 'Environment Variable IDs',
    name: 'envIds',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['environmentVariable'],
        operation: ['bulkDelete'],
      },
    },
    default: '',
    placeholder: 'env_id1, env_id2, env_id3',
    description: 'Comma-separated list of environment variable IDs to delete',
  },

  // Environment Variables (bulkCreate)
  {
    displayName: 'Environment Variables',
    name: 'envVars',
    type: 'fixedCollection',
    typeOptions: {
      multipleValues: true,
    },
    displayOptions: {
      show: {
        resource: ['environmentVariable'],
        operation: ['bulkCreate'],
      },
    },
    default: {},
    options: [
      {
        name: 'envVar',
        displayName: 'Environment Variable',
        values: [
          {
            displayName: 'Key',
            name: 'key',
            type: 'string',
            default: '',
            description: 'Environment variable key',
          },
          {
            displayName: 'Value',
            name: 'value',
            type: 'string',
            typeOptions: {
              password: true,
            },
            default: '',
            description: 'Environment variable value',
          },
          {
            displayName: 'Target',
            name: 'target',
            type: 'multiOptions',
            options: VERCEL_ENV_VARIABLE_TARGETS,
            default: ['production', 'preview', 'development'],
            description: 'Deployment targets',
          },
          {
            displayName: 'Type',
            name: 'type',
            type: 'options',
            options: VERCEL_ENV_VARIABLE_TYPES,
            default: 'plain',
            description: 'Variable type',
          },
        ],
      },
    ],
  },

  // Return All (getAll)
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    displayOptions: {
      show: {
        resource: ['environmentVariable'],
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
        resource: ['environmentVariable'],
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

  // Additional Fields (create)
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    displayOptions: {
      show: {
        resource: ['environmentVariable'],
        operation: ['create'],
      },
    },
    default: {},
    options: [
      {
        displayName: 'Comment',
        name: 'comment',
        type: 'string',
        default: '',
        description: 'Description or comment for the variable',
      },
      {
        displayName: 'Git Branch',
        name: 'gitBranch',
        type: 'string',
        default: '',
        description: 'Specific Git branch scope',
      },
      {
        displayName: 'Type',
        name: 'type',
        type: 'options',
        options: VERCEL_ENV_VARIABLE_TYPES,
        default: 'plain',
        description: 'Variable type',
      },
    ],
  },

  // Update Fields
  {
    displayName: 'Update Fields',
    name: 'updateFields',
    type: 'collection',
    placeholder: 'Add Field',
    displayOptions: {
      show: {
        resource: ['environmentVariable'],
        operation: ['update'],
      },
    },
    default: {},
    options: [
      {
        displayName: 'Comment',
        name: 'comment',
        type: 'string',
        default: '',
        description: 'Description or comment for the variable',
      },
      {
        displayName: 'Git Branch',
        name: 'gitBranch',
        type: 'string',
        default: '',
        description: 'Specific Git branch scope (empty to remove)',
      },
      {
        displayName: 'Target',
        name: 'target',
        type: 'multiOptions',
        options: VERCEL_ENV_VARIABLE_TARGETS,
        default: [],
        description: 'Deployment targets',
      },
      {
        displayName: 'Type',
        name: 'type',
        type: 'options',
        options: VERCEL_ENV_VARIABLE_TYPES,
        default: 'plain',
        description: 'Variable type',
      },
      {
        displayName: 'Value',
        name: 'value',
        type: 'string',
        typeOptions: {
          password: true,
        },
        default: '',
        description: 'New value for the variable',
      },
    ],
  },
];
