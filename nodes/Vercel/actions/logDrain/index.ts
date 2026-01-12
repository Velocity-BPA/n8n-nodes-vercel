/**
 * Velocity BPA Licensing Notice
 *
 * This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
 * Use of this node by for-profit organizations in production environments
 * requires a commercial license from Velocity BPA.
 *
 * For licensing information, visit https://velobpa.com/licensing
 * or contact licensing@velobpa.com.
 */

import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { vercelApiRequest, vercelApiRequestAllItems } from '../../transport/api';
import { LOG_DRAIN_SOURCES, LOG_DRAIN_TYPES } from '../../constants/constants';

export const logDrainOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['logDrain'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a log drain',
				action: 'Create a log drain',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a log drain',
				action: 'Delete a log drain',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get log drain details',
				action: 'Get a log drain',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many log drains',
				action: 'Get many log drains',
			},
		],
		default: 'getAll',
	},
];

export const logDrainFields: INodeProperties[] = [
	// ----------------------------------
	//         logDrain:create
	// ----------------------------------
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['logDrain'],
				operation: ['create'],
			},
		},
		description: 'The name of the log drain',
	},
	{
		displayName: 'Destination URL',
		name: 'url',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'https://logs.example.com/ingest',
		displayOptions: {
			show: {
				resource: ['logDrain'],
				operation: ['create'],
			},
		},
		description: 'The URL to send logs to',
	},
	{
		displayName: 'Type',
		name: 'type',
		type: 'options',
		required: true,
		options: LOG_DRAIN_TYPES.map((t: { name: string; value: string }) => ({
			name: t.name,
			value: t.value,
		})),
		default: 'json',
		displayOptions: {
			show: {
				resource: ['logDrain'],
				operation: ['create'],
			},
		},
		description: 'The format of the logs',
	},
	{
		displayName: 'Sources',
		name: 'sources',
		type: 'multiOptions',
		required: true,
		options: LOG_DRAIN_SOURCES.map((s: { name: string; value: string }) => ({
			name: s.name,
			value: s.value,
		})),
		default: [],
		displayOptions: {
			show: {
				resource: ['logDrain'],
				operation: ['create'],
			},
		},
		description: 'The log sources to include',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['logDrain'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Environment',
				name: 'environment',
				type: 'options',
				options: [
					{ name: 'Production', value: 'production' },
					{ name: 'Preview', value: 'preview' },
				],
				default: 'production',
				description: 'The environment to drain logs from',
			},
			{
				displayName: 'Headers',
				name: 'headers',
				type: 'fixedCollection',
				typeOptions: {
					multipleValues: true,
				},
				default: {},
				options: [
					{
						name: 'header',
						displayName: 'Header',
						values: [
							{
								displayName: 'Name',
								name: 'name',
								type: 'string',
								default: '',
							},
							{
								displayName: 'Value',
								name: 'value',
								type: 'string',
								default: '',
							},
						],
					},
				],
				description: 'Custom headers to send with log requests',
			},
			{
				displayName: 'Project ID',
				name: 'projectId',
				type: 'string',
				default: '',
				description: 'Limit log drain to a specific project',
			},
			{
				displayName: 'Sampling Rate',
				name: 'samplingRate',
				type: 'number',
				typeOptions: {
					minValue: 0,
					maxValue: 1,
				},
				default: 1,
				description: 'Sampling rate for logs (0-1)',
			},
			{
				displayName: 'Secret',
				name: 'secret',
				type: 'string',
				typeOptions: {
					password: true,
				},
				default: '',
				description: 'Secret for signing log drain payloads',
			},
		],
	},

	// ----------------------------------
	//         logDrain:get
	// ----------------------------------
	{
		displayName: 'Log Drain ID',
		name: 'logDrainId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['logDrain'],
				operation: ['get'],
			},
		},
		description: 'The ID of the log drain to retrieve',
	},

	// ----------------------------------
	//         logDrain:getAll
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['logDrain'],
				operation: ['getAll'],
			},
		},
		default: false,
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['logDrain'],
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
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['logDrain'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'Project ID',
				name: 'projectId',
				type: 'string',
				default: '',
				description: 'Filter log drains by project ID',
			},
		],
	},

	// ----------------------------------
	//         logDrain:delete
	// ----------------------------------
	{
		displayName: 'Log Drain ID',
		name: 'logDrainId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['logDrain'],
				operation: ['delete'],
			},
		},
		description: 'The ID of the log drain to delete',
	},
];

export async function executeLogDrainOperation(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<INodeExecutionData[]> {
	let responseData: IDataObject | IDataObject[];

	if (operation === 'create') {
		const name = this.getNodeParameter('name', i) as string;
		const url = this.getNodeParameter('url', i) as string;
		const type = this.getNodeParameter('type', i) as string;
		const sources = this.getNodeParameter('sources', i) as string[];
		const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

		const body: IDataObject = {
			name,
			url,
			type,
			sources,
		};

		if (additionalFields.projectId) {
			body.projectId = additionalFields.projectId;
		}
		if (additionalFields.environment) {
			body.environment = additionalFields.environment;
		}
		if (additionalFields.secret) {
			body.secret = additionalFields.secret;
		}
		if (additionalFields.samplingRate !== undefined) {
			body.samplingRate = additionalFields.samplingRate;
		}

		// Handle headers
		if (additionalFields.headers) {
			const headersData = additionalFields.headers as IDataObject;
			if (headersData.header && Array.isArray(headersData.header)) {
				const headers: IDataObject = {};
				for (const header of headersData.header as IDataObject[]) {
					if (header.name && header.value) {
						headers[header.name as string] = header.value;
					}
				}
				if (Object.keys(headers).length > 0) {
					body.headers = headers;
				}
			}
		}

		responseData = await vercelApiRequest.call(this, 'POST', '/v1/log-drains', body);
	} else if (operation === 'get') {
		const logDrainId = this.getNodeParameter('logDrainId', i) as string;

		responseData = await vercelApiRequest.call(
			this,
			'GET',
			`/v1/log-drains/${encodeURIComponent(logDrainId)}`,
		);
	} else if (operation === 'getAll') {
		const returnAll = this.getNodeParameter('returnAll', i) as boolean;
		const filters = this.getNodeParameter('filters', i) as IDataObject;

		const qs: IDataObject = {};
		if (filters.projectId) {
			qs.projectId = filters.projectId;
		}

		if (returnAll) {
			responseData = await vercelApiRequestAllItems.call(
				this,
				'GET',
				'/v1/log-drains',
				'logDrains',
				{},
				qs,
			);
		} else {
			const limit = this.getNodeParameter('limit', i) as number;
			qs.limit = limit;
			responseData = await vercelApiRequest.call(this, 'GET', '/v1/log-drains', {}, qs);
			// Log drains API might return array directly or wrapped
			if (!Array.isArray(responseData)) {
				responseData = (responseData as IDataObject).logDrains as IDataObject[] || [];
			}
		}
	} else if (operation === 'delete') {
		const logDrainId = this.getNodeParameter('logDrainId', i) as string;

		responseData = await vercelApiRequest.call(
			this,
			'DELETE',
			`/v1/log-drains/${encodeURIComponent(logDrainId)}`,
		);
	} else {
		throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
	}

	const executionData = this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray(responseData),
		{ itemData: { item: i } },
	);

	return executionData;
}
