/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { INodeProperties } from 'n8n-workflow';
import { VERCEL_DNS_RECORD_TYPES } from '../../constants/constants';

export const domainOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['domain'],
      },
    },
    options: [
      {
        name: 'Check Availability',
        value: 'checkAvailability',
        description: 'Check if domain is available',
        action: 'Check domain availability',
      },
      {
        name: 'Create',
        value: 'create',
        description: 'Add a domain to account/team',
        action: 'Create a domain',
      },
      {
        name: 'Create DNS Record',
        value: 'createDnsRecord',
        description: 'Create a DNS record for domain',
        action: 'Create DNS record',
      },
      {
        name: 'Delete',
        value: 'delete',
        description: 'Remove a domain',
        action: 'Delete a domain',
      },
      {
        name: 'Delete DNS Record',
        value: 'deleteDnsRecord',
        description: 'Delete a DNS record',
        action: 'Delete DNS record',
      },
      {
        name: 'Get',
        value: 'get',
        description: 'Get domain details',
        action: 'Get a domain',
      },
      {
        name: 'Get Config',
        value: 'getConfig',
        description: 'Get domain DNS configuration',
        action: 'Get domain config',
      },
      {
        name: 'Get DNS Records',
        value: 'getDnsRecords',
        description: 'Get DNS records for domain',
        action: 'Get DNS records',
      },
      {
        name: 'Get Many',
        value: 'getAll',
        description: 'Get many domains',
        action: 'Get many domains',
      },
      {
        name: 'Purchase',
        value: 'purchase',
        description: 'Purchase a domain',
        action: 'Purchase a domain',
      },
      {
        name: 'Transfer In',
        value: 'transferIn',
        description: 'Initiate domain transfer',
        action: 'Transfer domain',
      },
      {
        name: 'Verify',
        value: 'verify',
        description: 'Verify domain ownership',
        action: 'Verify a domain',
      },
    ],
    default: 'getAll',
  },
];

export const domainFields: INodeProperties[] = [
  // Domain
  {
    displayName: 'Domain',
    name: 'domain',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['domain'],
        operation: [
          'create',
          'get',
          'delete',
          'verify',
          'getConfig',
          'checkAvailability',
          'purchase',
          'transferIn',
          'getDnsRecords',
          'createDnsRecord',
          'deleteDnsRecord',
        ],
      },
    },
    default: '',
    placeholder: 'example.com',
    description: 'The domain name',
  },

  // Record ID (deleteDnsRecord)
  {
    displayName: 'Record ID',
    name: 'recordId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['domain'],
        operation: ['deleteDnsRecord'],
      },
    },
    default: '',
    description: 'The DNS record ID to delete',
  },

  // Record Type (createDnsRecord)
  {
    displayName: 'Record Type',
    name: 'recordType',
    type: 'options',
    required: true,
    displayOptions: {
      show: {
        resource: ['domain'],
        operation: ['createDnsRecord'],
      },
    },
    options: VERCEL_DNS_RECORD_TYPES,
    default: 'A',
    description: 'The DNS record type',
  },

  // Name (createDnsRecord)
  {
    displayName: 'Name',
    name: 'name',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['domain'],
        operation: ['createDnsRecord'],
      },
    },
    default: '',
    placeholder: '@',
    description: 'The record name (use @ for root)',
  },

  // Value (createDnsRecord)
  {
    displayName: 'Value',
    name: 'value',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['domain'],
        operation: ['createDnsRecord'],
      },
    },
    default: '',
    description: 'The record value',
  },

  // Auth Code (transferIn)
  {
    displayName: 'Auth Code',
    name: 'authCode',
    type: 'string',
    typeOptions: {
      password: true,
    },
    required: true,
    displayOptions: {
      show: {
        resource: ['domain'],
        operation: ['transferIn'],
      },
    },
    default: '',
    description: 'The authorization code for domain transfer',
  },

  // Expected Price (purchase, transferIn)
  {
    displayName: 'Expected Price',
    name: 'expectedPrice',
    type: 'number',
    required: true,
    displayOptions: {
      show: {
        resource: ['domain'],
        operation: ['purchase', 'transferIn'],
      },
    },
    default: 0,
    description: 'Expected price in cents to confirm purchase',
  },

  // Return All (getAll, getDnsRecords)
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    displayOptions: {
      show: {
        resource: ['domain'],
        operation: ['getAll', 'getDnsRecords'],
      },
    },
    default: false,
    description: 'Whether to return all results or only up to a given limit',
  },

  // Limit (getAll, getDnsRecords)
  {
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    displayOptions: {
      show: {
        resource: ['domain'],
        operation: ['getAll', 'getDnsRecords'],
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
        resource: ['domain'],
        operation: ['create'],
      },
    },
    default: {},
    options: [
      {
        displayName: 'CDN Enabled',
        name: 'cdnEnabled',
        type: 'boolean',
        default: true,
        description: 'Whether to enable CDN for this domain',
      },
      {
        displayName: 'Zone',
        name: 'zone',
        type: 'boolean',
        default: false,
        description: 'Whether to add this domain as a DNS zone',
      },
    ],
  },

  // Additional Fields (createDnsRecord)
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    displayOptions: {
      show: {
        resource: ['domain'],
        operation: ['createDnsRecord'],
      },
    },
    default: {},
    options: [
      {
        displayName: 'MX Priority',
        name: 'mxPriority',
        type: 'number',
        default: 10,
        description: 'Priority for MX records',
        displayOptions: {
          show: {
            '/recordType': ['MX'],
          },
        },
      },
      {
        displayName: 'SRV Port',
        name: 'srvPort',
        type: 'number',
        default: 0,
        description: 'Port for SRV records',
        displayOptions: {
          show: {
            '/recordType': ['SRV'],
          },
        },
      },
      {
        displayName: 'SRV Priority',
        name: 'srvPriority',
        type: 'number',
        default: 0,
        description: 'Priority for SRV records',
        displayOptions: {
          show: {
            '/recordType': ['SRV'],
          },
        },
      },
      {
        displayName: 'SRV Target',
        name: 'srvTarget',
        type: 'string',
        default: '',
        description: 'Target for SRV records',
        displayOptions: {
          show: {
            '/recordType': ['SRV'],
          },
        },
      },
      {
        displayName: 'SRV Weight',
        name: 'srvWeight',
        type: 'number',
        default: 0,
        description: 'Weight for SRV records',
        displayOptions: {
          show: {
            '/recordType': ['SRV'],
          },
        },
      },
      {
        displayName: 'TTL',
        name: 'ttl',
        type: 'number',
        default: 60,
        description: 'Time to live in seconds',
      },
    ],
  },
];
