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

export const edgeConfigOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['edgeConfig'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create an edge config store',
				action: 'Create an edge config',
			},
			{
				name: 'Create Token',
				value: 'createToken',
				description: 'Create an access token for edge config',
				action: 'Create edge config token',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete an edge config',
				action: 'Delete an edge config',
			},
			{
				name: 'Delete Item',
				value: 'deleteItem',
				description: 'Delete a specific item from edge config',
				action: 'Delete edge config item',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get edge config details',
				action: 'Get an edge config',
			},
			{
				name: 'Get Item',
				value: 'getItem',
				description: 'Get a specific item from edge config',
				action: 'Get edge config item',
			},
			{
				name: 'Get Items',
				value: 'getItems',
				description: 'Get all items in edge config',
				action: 'Get edge config items',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many edge configs',
				action: 'Get many edge configs',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update edge config',
				action: 'Update an edge config',
			},
			{
				name: 'Update Items',
				value: 'updateItems',
				description: 'Update multiple items in edge config',
				action: 'Update edge config items',
			},
		],
		default: 'getAll',
	},
];

export const edgeConfigFields: INodeProperties[] = [
	// ----------------------------------
	//         edgeConfig:create
	// ----------------------------------
	{
		displayName: 'Slug',
		name: 'slug',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['edgeConfig'],
				operation: ['create'],
			},
		},
		description: 'The slug/name for the edge config (alphanumeric, underscores)',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['edgeConfig'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Initial Items (JSON)',
				name: 'items',
				type: 'json',
				default: '{}',
				description: 'Initial key-value items to store',
			},
		],
	},

	// ----------------------------------
	//         edgeConfig:get
	// ----------------------------------
	{
		displayName: 'Edge Config ID',
		name: 'edgeConfigId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['edgeConfig'],
				operation: ['get'],
			},
		},
		description: 'The ID of the edge config',
	},

	// ----------------------------------
	//         edgeConfig:getAll
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['edgeConfig'],
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
				resource: ['edgeConfig'],
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

	// ----------------------------------
	//         edgeConfig:update
	// ----------------------------------
	{
		displayName: 'Edge Config ID',
		name: 'edgeConfigId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['edgeConfig'],
				operation: ['update'],
			},
		},
		description: 'The ID of the edge config to update',
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['edgeConfig'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Slug',
				name: 'slug',
				type: 'string',
				default: '',
				description: 'New slug for the edge config',
			},
		],
	},

	// ----------------------------------
	//         edgeConfig:delete
	// ----------------------------------
	{
		displayName: 'Edge Config ID',
		name: 'edgeConfigId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['edgeConfig'],
				operation: ['delete'],
			},
		},
		description: 'The ID of the edge config to delete',
	},

	// ----------------------------------
	//         edgeConfig:getItems
	// ----------------------------------
	{
		displayName: 'Edge Config ID',
		name: 'edgeConfigId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['edgeConfig'],
				operation: ['getItems'],
			},
		},
		description: 'The ID of the edge config',
	},

	// ----------------------------------
	//         edgeConfig:getItem
	// ----------------------------------
	{
		displayName: 'Edge Config ID',
		name: 'edgeConfigId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['edgeConfig'],
				operation: ['getItem'],
			},
		},
		description: 'The ID of the edge config',
	},
	{
		displayName: 'Item Key',
		name: 'itemKey',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['edgeConfig'],
				operation: ['getItem'],
			},
		},
		description: 'The key of the item to retrieve',
	},

	// ----------------------------------
	//         edgeConfig:updateItems
	// ----------------------------------
	{
		displayName: 'Edge Config ID',
		name: 'edgeConfigId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['edgeConfig'],
				operation: ['updateItems'],
			},
		},
		description: 'The ID of the edge config',
	},
	{
		displayName: 'Items',
		name: 'items',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		default: {},
		displayOptions: {
			show: {
				resource: ['edgeConfig'],
				operation: ['updateItems'],
			},
		},
		options: [
			{
				name: 'item',
				displayName: 'Item',
				values: [
					{
						displayName: 'Operation',
						name: 'operation',
						type: 'options',
						options: [
							{ name: 'Create', value: 'create' },
							{ name: 'Update', value: 'update' },
							{ name: 'Upsert', value: 'upsert' },
							{ name: 'Delete', value: 'delete' },
						],
						default: 'upsert',
						description: 'The operation to perform on this item',
					},
					{
						displayName: 'Key',
						name: 'key',
						type: 'string',
						default: '',
						description: 'The key of the item',
					},
					{
						displayName: 'Value',
						name: 'value',
						type: 'string',
						default: '',
						description: 'The value of the item (not required for delete)',
					},
				],
			},
		],
		description: 'Items to update in the edge config',
	},

	// ----------------------------------
	//         edgeConfig:deleteItem
	// ----------------------------------
	{
		displayName: 'Edge Config ID',
		name: 'edgeConfigId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['edgeConfig'],
				operation: ['deleteItem'],
			},
		},
		description: 'The ID of the edge config',
	},
	{
		displayName: 'Item Key',
		name: 'itemKey',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['edgeConfig'],
				operation: ['deleteItem'],
			},
		},
		description: 'The key of the item to delete',
	},

	// ----------------------------------
	//         edgeConfig:createToken
	// ----------------------------------
	{
		displayName: 'Edge Config ID',
		name: 'edgeConfigId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['edgeConfig'],
				operation: ['createToken'],
			},
		},
		description: 'The ID of the edge config',
	},
	{
		displayName: 'Label',
		name: 'label',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['edgeConfig'],
				operation: ['createToken'],
			},
		},
		description: 'A label for the token',
	},
];

export async function executeEdgeConfigOperation(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<INodeExecutionData[]> {
	let responseData: IDataObject | IDataObject[];

	if (operation === 'create') {
		const slug = this.getNodeParameter('slug', i) as string;
		const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

		const body: IDataObject = {
			slug,
		};

		if (additionalFields.items) {
			try {
				body.items = typeof additionalFields.items === 'string' 
					? JSON.parse(additionalFields.items) 
					: additionalFields.items;
			} catch {
				throw new NodeOperationError(this.getNode(), 'Invalid JSON for items');
			}
		}

		responseData = await vercelApiRequest.call(this, 'POST', '/v1/edge-config', body);
	} else if (operation === 'get') {
		const edgeConfigId = this.getNodeParameter('edgeConfigId', i) as string;

		responseData = await vercelApiRequest.call(
			this,
			'GET',
			`/v1/edge-config/${encodeURIComponent(edgeConfigId)}`,
		);
	} else if (operation === 'getAll') {
		const returnAll = this.getNodeParameter('returnAll', i) as boolean;

		if (returnAll) {
			responseData = await vercelApiRequestAllItems.call(
				this,
				'GET',
				'/v1/edge-config',
				'edgeConfigs',
				{},
				{},
			);
		} else {
			const limit = this.getNodeParameter('limit', i) as number;
			responseData = await vercelApiRequest.call(this, 'GET', '/v1/edge-config', {}, { limit });
			// Handle array response
			if (!Array.isArray(responseData)) {
				responseData = (responseData as IDataObject).edgeConfigs as IDataObject[] || [];
			}
		}
	} else if (operation === 'update') {
		const edgeConfigId = this.getNodeParameter('edgeConfigId', i) as string;
		const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;

		const body: IDataObject = {};

		if (updateFields.slug) {
			body.slug = updateFields.slug;
		}

		responseData = await vercelApiRequest.call(
			this,
			'PATCH',
			`/v1/edge-config/${encodeURIComponent(edgeConfigId)}`,
			body,
		);
	} else if (operation === 'delete') {
		const edgeConfigId = this.getNodeParameter('edgeConfigId', i) as string;

		responseData = await vercelApiRequest.call(
			this,
			'DELETE',
			`/v1/edge-config/${encodeURIComponent(edgeConfigId)}`,
		);
	} else if (operation === 'getItems') {
		const edgeConfigId = this.getNodeParameter('edgeConfigId', i) as string;

		responseData = await vercelApiRequest.call(
			this,
			'GET',
			`/v1/edge-config/${encodeURIComponent(edgeConfigId)}/items`,
		);
	} else if (operation === 'getItem') {
		const edgeConfigId = this.getNodeParameter('edgeConfigId', i) as string;
		const itemKey = this.getNodeParameter('itemKey', i) as string;

		responseData = await vercelApiRequest.call(
			this,
			'GET',
			`/v1/edge-config/${encodeURIComponent(edgeConfigId)}/item/${encodeURIComponent(itemKey)}`,
		);
	} else if (operation === 'updateItems') {
		const edgeConfigId = this.getNodeParameter('edgeConfigId', i) as string;
		const itemsData = this.getNodeParameter('items', i) as IDataObject;

		const items: IDataObject[] = [];

		if (itemsData.item && Array.isArray(itemsData.item)) {
			for (const item of itemsData.item as IDataObject[]) {
				const itemObj: IDataObject = {
					operation: item.operation,
					key: item.key,
				};
				if (item.operation !== 'delete' && item.value !== undefined) {
					// Try to parse as JSON, otherwise use as string
					try {
						itemObj.value = JSON.parse(item.value as string);
					} catch {
						itemObj.value = item.value;
					}
				}
				items.push(itemObj);
			}
		}

		responseData = await vercelApiRequest.call(
			this,
			'PATCH',
			`/v1/edge-config/${encodeURIComponent(edgeConfigId)}/items`,
			{ items },
		);
	} else if (operation === 'deleteItem') {
		const edgeConfigId = this.getNodeParameter('edgeConfigId', i) as string;
		const itemKey = this.getNodeParameter('itemKey', i) as string;

		// Use the updateItems endpoint with delete operation
		responseData = await vercelApiRequest.call(
			this,
			'PATCH',
			`/v1/edge-config/${encodeURIComponent(edgeConfigId)}/items`,
			{
				items: [
					{
						operation: 'delete',
						key: itemKey,
					},
				],
			},
		);
	} else if (operation === 'createToken') {
		const edgeConfigId = this.getNodeParameter('edgeConfigId', i) as string;
		const label = this.getNodeParameter('label', i) as string;

		responseData = await vercelApiRequest.call(
			this,
			'POST',
			`/v1/edge-config/${encodeURIComponent(edgeConfigId)}/token`,
			{ label },
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
