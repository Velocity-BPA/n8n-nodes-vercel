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
import { WEBHOOK_EVENTS } from '../../constants/constants';

export const webhookOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['webhook'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a webhook',
				action: 'Create a webhook',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a webhook',
				action: 'Delete a webhook',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get webhook details',
				action: 'Get a webhook',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many webhooks',
				action: 'Get many webhooks',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a webhook',
				action: 'Update a webhook',
			},
		],
		default: 'getAll',
	},
];

export const webhookFields: INodeProperties[] = [
	// ----------------------------------
	//         webhook:create
	// ----------------------------------
	{
		displayName: 'URL',
		name: 'url',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'https://example.com/webhook',
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['create'],
			},
		},
		description: 'The URL to receive webhook events',
	},
	{
		displayName: 'Events',
		name: 'events',
		type: 'multiOptions',
		required: true,
		options: WEBHOOK_EVENTS.map((e: { name: string; value: string }) => ({
			name: e.name,
			value: e.value,
		})),
		default: [],
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['create'],
			},
		},
		description: 'The events to subscribe to',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Project IDs',
				name: 'projectIds',
				type: 'string',
				default: '',
				description: 'Comma-separated list of project IDs to filter events (empty for all projects)',
			},
		],
	},

	// ----------------------------------
	//         webhook:get
	// ----------------------------------
	{
		displayName: 'Webhook ID',
		name: 'webhookId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['get'],
			},
		},
		description: 'The ID of the webhook to retrieve',
	},

	// ----------------------------------
	//         webhook:getAll
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['webhook'],
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
				resource: ['webhook'],
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
				resource: ['webhook'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'Project ID',
				name: 'projectId',
				type: 'string',
				default: '',
				description: 'Filter webhooks by project ID',
			},
		],
	},

	// ----------------------------------
	//         webhook:update
	// ----------------------------------
	{
		displayName: 'Webhook ID',
		name: 'webhookId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['update'],
			},
		},
		description: 'The ID of the webhook to update',
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Events',
				name: 'events',
				type: 'multiOptions',
				options: WEBHOOK_EVENTS.map((e: { name: string; value: string }) => ({
					name: e.name,
					value: e.value,
				})),
				default: [],
				description: 'The events to subscribe to',
			},
			{
				displayName: 'Project IDs',
				name: 'projectIds',
				type: 'string',
				default: '',
				description: 'Comma-separated list of project IDs to filter events',
			},
			{
				displayName: 'URL',
				name: 'url',
				type: 'string',
				default: '',
				description: 'The URL to receive webhook events',
			},
		],
	},

	// ----------------------------------
	//         webhook:delete
	// ----------------------------------
	{
		displayName: 'Webhook ID',
		name: 'webhookId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['delete'],
			},
		},
		description: 'The ID of the webhook to delete',
	},
];

export async function executeWebhookOperation(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<INodeExecutionData[]> {
	let responseData: IDataObject | IDataObject[];

	if (operation === 'create') {
		const url = this.getNodeParameter('url', i) as string;
		const events = this.getNodeParameter('events', i) as string[];
		const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

		const body: IDataObject = {
			url,
			events,
		};

		if (additionalFields.projectIds) {
			const projectIds = (additionalFields.projectIds as string)
				.split(',')
				.map((id) => id.trim())
				.filter((id) => id);
			if (projectIds.length > 0) {
				body.projectIds = projectIds;
			}
		}

		responseData = await vercelApiRequest.call(this, 'POST', '/v1/webhooks', body);
	} else if (operation === 'get') {
		const webhookId = this.getNodeParameter('webhookId', i) as string;

		responseData = await vercelApiRequest.call(
			this,
			'GET',
			`/v1/webhooks/${encodeURIComponent(webhookId)}`,
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
				'/v1/webhooks',
				'webhooks',
				{},
				qs,
			);
		} else {
			const limit = this.getNodeParameter('limit', i) as number;
			qs.limit = limit;
			responseData = await vercelApiRequest.call(this, 'GET', '/v1/webhooks', {}, qs);
			// Webhooks API might return array directly
			if (!Array.isArray(responseData)) {
				responseData = (responseData as IDataObject).webhooks as IDataObject[] || [];
			}
		}
	} else if (operation === 'update') {
		const webhookId = this.getNodeParameter('webhookId', i) as string;
		const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;

		const body: IDataObject = {};

		if (updateFields.url) {
			body.url = updateFields.url;
		}
		if (updateFields.events && (updateFields.events as string[]).length > 0) {
			body.events = updateFields.events;
		}
		if (updateFields.projectIds) {
			const projectIds = (updateFields.projectIds as string)
				.split(',')
				.map((id) => id.trim())
				.filter((id) => id);
			if (projectIds.length > 0) {
				body.projectIds = projectIds;
			}
		}

		responseData = await vercelApiRequest.call(
			this,
			'PATCH',
			`/v1/webhooks/${encodeURIComponent(webhookId)}`,
			body,
		);
	} else if (operation === 'delete') {
		const webhookId = this.getNodeParameter('webhookId', i) as string;

		responseData = await vercelApiRequest.call(
			this,
			'DELETE',
			`/v1/webhooks/${encodeURIComponent(webhookId)}`,
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
