/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { INodeProperties } from 'n8n-workflow';
import {
  VERCEL_FRAMEWORKS,
  VERCEL_NODE_VERSIONS,
  VERCEL_REGIONS,
  VERCEL_GIT_PROVIDERS,
  VERCEL_REDIRECT_STATUS_CODES,
} from '../../constants/constants';

export const projectOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['project'],
      },
    },
    options: [
      {
        name: 'Add Domain',
        value: 'addDomain',
        description: 'Add a domain to a project',
        action: 'Add domain to project',
      },
      {
        name: 'Create',
        value: 'create',
        description: 'Create a new project',
        action: 'Create a project',
      },
      {
        name: 'Delete',
        value: 'delete',
        description: 'Delete a project',
        action: 'Delete a project',
      },
      {
        name: 'Get',
        value: 'get',
        description: 'Get project details',
        action: 'Get a project',
      },
      {
        name: 'Get Many',
        value: 'getAll',
        description: 'Get many projects',
        action: 'Get many projects',
      },
      {
        name: 'Get Production Deployment',
        value: 'getProductionDeployment',
        description: 'Get the current production deployment',
        action: 'Get production deployment',
      },
      {
        name: 'Link Git Repository',
        value: 'linkGitRepository',
        description: 'Link a Git repository to a project',
        action: 'Link git repository',
      },
      {
        name: 'Pause',
        value: 'pauseProject',
        description: 'Pause a project',
        action: 'Pause a project',
      },
      {
        name: 'Remove Domain',
        value: 'removeDomain',
        description: 'Remove a domain from a project',
        action: 'Remove domain from project',
      },
      {
        name: 'Unlink Git Repository',
        value: 'unlinkGitRepository',
        description: 'Unlink a Git repository from a project',
        action: 'Unlink git repository',
      },
      {
        name: 'Unpause',
        value: 'unpauseProject',
        description: 'Unpause a project',
        action: 'Unpause a project',
      },
      {
        name: 'Update',
        value: 'update',
        description: 'Update project settings',
        action: 'Update a project',
      },
    ],
    default: 'getAll',
  },
];

export const projectFields: INodeProperties[] = [
  // Project Name (create)
  {
    displayName: 'Name',
    name: 'name',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['project'],
        operation: ['create'],
      },
    },
    default: '',
    description: 'Project name (lowercase, alphanumeric, hyphens allowed)',
  },

  // Project ID (get, update, delete, etc.)
  {
    displayName: 'Project ID or Name',
    name: 'projectId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['project'],
        operation: [
          'get',
          'update',
          'delete',
          'addDomain',
          'removeDomain',
          'getProductionDeployment',
          'linkGitRepository',
          'unlinkGitRepository',
          'pauseProject',
          'unpauseProject',
        ],
      },
    },
    default: '',
    description: 'The unique project identifier or name',
  },

  // Framework (create)
  {
    displayName: 'Framework',
    name: 'framework',
    type: 'options',
    displayOptions: {
      show: {
        resource: ['project'],
        operation: ['create'],
      },
    },
    options: VERCEL_FRAMEWORKS,
    default: 'nextjs',
    description: 'The framework preset for the project',
  },

  // Domain (addDomain, removeDomain)
  {
    displayName: 'Domain',
    name: 'domain',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['project'],
        operation: ['addDomain', 'removeDomain'],
      },
    },
    default: '',
    placeholder: 'example.com',
    description: 'The domain name to add or remove',
  },

  // Git Provider (linkGitRepository)
  {
    displayName: 'Git Provider',
    name: 'gitProvider',
    type: 'options',
    required: true,
    displayOptions: {
      show: {
        resource: ['project'],
        operation: ['linkGitRepository'],
      },
    },
    options: VERCEL_GIT_PROVIDERS,
    default: 'github',
    description: 'The Git provider to use',
  },

  // Repository (linkGitRepository)
  {
    displayName: 'Repository',
    name: 'repo',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['project'],
        operation: ['linkGitRepository'],
      },
    },
    default: '',
    placeholder: 'owner/repo-name',
    description: 'The repository in the format owner/repo-name',
  },

  // Return All (getAll)
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    displayOptions: {
      show: {
        resource: ['project'],
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
        resource: ['project'],
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
        resource: ['project'],
        operation: ['getAll'],
      },
    },
    default: {},
    options: [
      {
        displayName: 'Search',
        name: 'search',
        type: 'string',
        default: '',
        description: 'Search projects by name',
      },
      {
        displayName: 'Git Fork Protection',
        name: 'gitForkProtection',
        type: 'boolean',
        default: false,
        description: 'Whether to filter by Git fork protection status',
      },
      {
        displayName: 'Repository URL',
        name: 'repoUrl',
        type: 'string',
        default: '',
        description: 'Filter by repository URL',
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
        resource: ['project'],
        operation: ['create'],
      },
    },
    default: {},
    options: [
      {
        displayName: 'Build Command',
        name: 'buildCommand',
        type: 'string',
        default: '',
        description: 'Custom build command',
      },
      {
        displayName: 'Development Command',
        name: 'devCommand',
        type: 'string',
        default: '',
        description: 'Custom development command',
      },
      {
        displayName: 'Git Repository',
        name: 'gitRepository',
        type: 'fixedCollection',
        typeOptions: {
          multipleValues: false,
        },
        default: {},
        options: [
          {
            name: 'gitRepositoryValues',
            displayName: 'Git Repository',
            values: [
              {
                displayName: 'Type',
                name: 'type',
                type: 'options',
                options: VERCEL_GIT_PROVIDERS,
                default: 'github',
              },
              {
                displayName: 'Repository',
                name: 'repo',
                type: 'string',
                default: '',
                placeholder: 'owner/repo-name',
              },
            ],
          },
        ],
      },
      {
        displayName: 'Install Command',
        name: 'installCommand',
        type: 'string',
        default: '',
        description: 'Custom package install command',
      },
      {
        displayName: 'Node.js Version',
        name: 'nodeVersion',
        type: 'options',
        options: VERCEL_NODE_VERSIONS,
        default: '20.x',
        description: 'Node.js version to use',
      },
      {
        displayName: 'Output Directory',
        name: 'outputDirectory',
        type: 'string',
        default: '',
        description: 'Build output directory',
      },
      {
        displayName: 'Public Source',
        name: 'publicSource',
        type: 'boolean',
        default: false,
        description: 'Whether the source code is publicly visible',
      },
      {
        displayName: 'Root Directory',
        name: 'rootDirectory',
        type: 'string',
        default: '',
        description: 'Root directory for monorepos',
      },
      {
        displayName: 'Serverless Function Region',
        name: 'serverlessFunctionRegion',
        type: 'options',
        options: VERCEL_REGIONS,
        default: 'iad1',
        description: 'Default region for serverless functions',
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
        resource: ['project'],
        operation: ['update'],
      },
    },
    default: {},
    options: [
      {
        displayName: 'Auto Expose System Env Vars',
        name: 'autoExposeSystemEnvs',
        type: 'boolean',
        default: true,
        description: 'Whether to automatically expose system environment variables',
      },
      {
        displayName: 'Build Command',
        name: 'buildCommand',
        type: 'string',
        default: '',
        description: 'Custom build command',
      },
      {
        displayName: 'Command for Ignoring Build Step',
        name: 'commandForIgnoringBuildStep',
        type: 'string',
        default: '',
        description: 'Command to determine if build step should be ignored',
      },
      {
        displayName: 'Development Command',
        name: 'devCommand',
        type: 'string',
        default: '',
        description: 'Custom development command',
      },
      {
        displayName: 'Framework',
        name: 'framework',
        type: 'options',
        options: VERCEL_FRAMEWORKS,
        default: 'nextjs',
        description: 'The framework preset for the project',
      },
      {
        displayName: 'Install Command',
        name: 'installCommand',
        type: 'string',
        default: '',
        description: 'Custom package install command',
      },
      {
        displayName: 'Name',
        name: 'name',
        type: 'string',
        default: '',
        description: 'New project name',
      },
      {
        displayName: 'Node.js Version',
        name: 'nodeVersion',
        type: 'options',
        options: VERCEL_NODE_VERSIONS,
        default: '20.x',
        description: 'Node.js version to use',
      },
      {
        displayName: 'Output Directory',
        name: 'outputDirectory',
        type: 'string',
        default: '',
        description: 'Build output directory',
      },
      {
        displayName: 'Public Source',
        name: 'publicSource',
        type: 'boolean',
        default: false,
        description: 'Whether the source code is publicly visible',
      },
      {
        displayName: 'Root Directory',
        name: 'rootDirectory',
        type: 'string',
        default: '',
        description: 'Root directory for monorepos',
      },
      {
        displayName: 'Serverless Function Region',
        name: 'serverlessFunctionRegion',
        type: 'options',
        options: VERCEL_REGIONS,
        default: 'iad1',
        description: 'Default region for serverless functions',
      },
    ],
  },

  // Additional Fields (addDomain)
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    displayOptions: {
      show: {
        resource: ['project'],
        operation: ['addDomain'],
      },
    },
    default: {},
    options: [
      {
        displayName: 'Git Branch',
        name: 'gitBranch',
        type: 'string',
        default: '',
        description: 'Git branch to link the domain to',
      },
      {
        displayName: 'Redirect',
        name: 'redirect',
        type: 'string',
        default: '',
        description: 'Target domain for redirect',
      },
      {
        displayName: 'Redirect Status Code',
        name: 'redirectStatusCode',
        type: 'options',
        options: VERCEL_REDIRECT_STATUS_CODES,
        default: 308,
        description: 'HTTP status code for redirect',
      },
    ],
  },

  // Additional Fields (linkGitRepository)
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    displayOptions: {
      show: {
        resource: ['project'],
        operation: ['linkGitRepository'],
      },
    },
    default: {},
    options: [
      {
        displayName: 'Production Branch',
        name: 'productionBranch',
        type: 'string',
        default: 'main',
        description: 'The production branch for deployments',
      },
      {
        displayName: 'Sourceless',
        name: 'sourceless',
        type: 'boolean',
        default: false,
        description: 'Whether to enable sourceless deployments',
      },
    ],
  },
];
