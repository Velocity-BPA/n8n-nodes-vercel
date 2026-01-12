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

export const secretOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['secret'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new secret',
				action: 'Create a secret',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a secret',
				action: 'Delete a secret',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get secret metadata',
				action: 'Get a secret',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many secrets',
				action: 'Get many secrets',
			},
			{
				name: 'Rename',
				value: 'rename',
				description: 'Rename a secret',
				action: 'Rename a secret',
			},
		],
		default: 'getAll',
	},
];

export const secretFields: INodeProperties[] = [
	// ----------------------------------
	//         secret:create
	// ----------------------------------
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['secret'],
				operation: ['create'],
			},
		},
		description: 'The name of the secret (alphanumeric, underscores, hyphens)',
	},
	{
		displayName: 'Value',
		name: 'value',
		type: 'string',
		typeOptions: {
			password: true,
		},
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['secret'],
				operation: ['create'],
			},
		},
		description: 'The value of the secret',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['secret'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Project ID',
				name: 'projectId',
				type: 'string',
				default: '',
				description: 'Link the secret to a specific project',
			},
			{
				displayName: 'Decrypt',
				name: 'decryptable',
				type: 'boolean',
				default: false,
				description: 'Whether the secret can be decrypted after creation',
			},
		],
	},

	// ----------------------------------
	//         secret:get
	// ----------------------------------
	{
		displayName: 'Secret ID or Name',
		name: 'secretId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['secret'],
				operation: ['get'],
			},
		},
		description: 'The ID or name of the secret to retrieve',
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['secret'],
				operation: ['get'],
			},
		},
		options: [
			{
				displayName: 'Decrypt',
				name: 'decrypt',
				type: 'boolean',
				default: false,
				description: 'Whether to decrypt and return the secret value',
			},
		],
	},

	// ----------------------------------
	//         secret:getAll
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['secret'],
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
				resource: ['secret'],
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
				resource: ['secret'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'Project ID',
				name: 'projectId',
				type: 'string',
				default: '',
				description: 'Filter secrets by project ID',
			},
		],
	},

	// ----------------------------------
	//         secret:delete
	// ----------------------------------
	{
		displayName: 'Secret ID or Name',
		name: 'secretId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['secret'],
				operation: ['delete'],
			},
		},
		description: 'The ID or name of the secret to delete',
	},

	// ----------------------------------
	//         secret:rename
	// ----------------------------------
	{
		displayName: 'Secret ID or Name',
		name: 'secretId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['secret'],
				operation: ['rename'],
			},
		},
		description: 'The ID or name of the secret to rename',
	},
	{
		displayName: 'New Name',
		name: 'newName',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['secret'],
				operation: ['rename'],
			},
		},
		description: 'The new name for the secret',
	},
];

export async function executeSecretOperation(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<INodeExecutionData[]> {
	let responseData: IDataObject | IDataObject[];

	if (operation === 'create') {
		const name = this.getNodeParameter('name', i) as string;
		const value = this.getNodeParameter('value', i) as string;
		const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

		const body: IDataObject = {
			name,
			value,
		};

		if (additionalFields.decryptable !== undefined) {
			body.decryptable = additionalFields.decryptable;
		}

		const qs: IDataObject = {};
		if (additionalFields.projectId) {
			qs.projectId = additionalFields.projectId;
		}

		responseData = await vercelApiRequest.call(this, 'POST', '/v2/secrets', body, qs);
	} else if (operation === 'get') {
		const secretId = this.getNodeParameter('secretId', i) as string;
		const options = this.getNodeParameter('options', i) as IDataObject;

		const qs: IDataObject = {};
		if (options.decrypt) {
			qs.decrypt = 'true';
		}

		responseData = await vercelApiRequest.call(
			this,
			'GET',
			`/v3/secrets/${encodeURIComponent(secretId)}`,
			{},
			qs,
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
				'/v3/secrets',
				'secrets',
				{},
				qs,
			);
		} else {
			const limit = this.getNodeParameter('limit', i) as number;
			qs.limit = limit;
			const response = await vercelApiRequest.call(this, 'GET', '/v3/secrets', {}, qs) as IDataObject;
			responseData = (response.secrets as IDataObject[]) || [];
		}
	} else if (operation === 'delete') {
		const secretId = this.getNodeParameter('secretId', i) as string;
		responseData = await vercelApiRequest.call(
			this,
			'DELETE',
			`/v2/secrets/${encodeURIComponent(secretId)}`,
		);
	} else if (operation === 'rename') {
		const secretId = this.getNodeParameter('secretId', i) as string;
		const newName = this.getNodeParameter('newName', i) as string;

		responseData = await vercelApiRequest.call(
			this,
			'PATCH',
			`/v2/secrets/${encodeURIComponent(secretId)}`,
			{ name: newName },
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
