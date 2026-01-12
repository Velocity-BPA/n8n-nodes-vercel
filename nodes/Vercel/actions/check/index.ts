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
import { CHECK_CONCLUSIONS, CHECK_STATUSES } from '../../constants/constants';

export const checkOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['check'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a deployment check',
				action: 'Create a check',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get check details',
				action: 'Get a check',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many checks for a deployment',
				action: 'Get many checks',
			},
			{
				name: 'Rerequest',
				value: 'rerequest',
				description: 'Re-request a check run',
				action: 'Rerequest a check',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update check status or conclusion',
				action: 'Update a check',
			},
		],
		default: 'getAll',
	},
];

export const checkFields: INodeProperties[] = [
	// ----------------------------------
	//         check:create
	// ----------------------------------
	{
		displayName: 'Deployment ID',
		name: 'deploymentId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['check'],
				operation: ['create'],
			},
		},
		description: 'The deployment ID to create a check for',
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['check'],
				operation: ['create'],
			},
		},
		description: 'The name of the check',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['check'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Blocking',
				name: 'blocking',
				type: 'boolean',
				default: true,
				description: 'Whether the check blocks deployment completion',
			},
			{
				displayName: 'Details URL',
				name: 'detailsUrl',
				type: 'string',
				default: '',
				description: 'URL with more details about the check',
			},
			{
				displayName: 'External ID',
				name: 'externalId',
				type: 'string',
				default: '',
				description: 'External identifier for the check',
			},
			{
				displayName: 'Path',
				name: 'path',
				type: 'string',
				default: '',
				description: 'Path of the file being checked',
			},
			{
				displayName: 'Rerequest',
				name: 'rerequestable',
				type: 'boolean',
				default: true,
				description: 'Whether the check can be re-requested',
			},
		],
	},

	// ----------------------------------
	//         check:get
	// ----------------------------------
	{
		displayName: 'Deployment ID',
		name: 'deploymentId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['check'],
				operation: ['get'],
			},
		},
		description: 'The deployment ID',
	},
	{
		displayName: 'Check ID',
		name: 'checkId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['check'],
				operation: ['get'],
			},
		},
		description: 'The check ID to retrieve',
	},

	// ----------------------------------
	//         check:getAll
	// ----------------------------------
	{
		displayName: 'Deployment ID',
		name: 'deploymentId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['check'],
				operation: ['getAll'],
			},
		},
		description: 'The deployment ID to list checks for',
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['check'],
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
				resource: ['check'],
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
	//         check:update
	// ----------------------------------
	{
		displayName: 'Deployment ID',
		name: 'deploymentId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['check'],
				operation: ['update'],
			},
		},
		description: 'The deployment ID',
	},
	{
		displayName: 'Check ID',
		name: 'checkId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['check'],
				operation: ['update'],
			},
		},
		description: 'The check ID to update',
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['check'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Conclusion',
				name: 'conclusion',
				type: 'options',
				options: CHECK_CONCLUSIONS.map((c) => ({ name: c.charAt(0).toUpperCase() + c.slice(1), value: c })),
				default: 'succeeded',
				description: 'The conclusion of the check',
			},
			{
				displayName: 'Details URL',
				name: 'detailsUrl',
				type: 'string',
				default: '',
				description: 'URL with more details about the check',
			},
			{
				displayName: 'External ID',
				name: 'externalId',
				type: 'string',
				default: '',
				description: 'External identifier for the check',
			},
			{
				displayName: 'Output Summary',
				name: 'outputSummary',
				type: 'string',
				typeOptions: {
					rows: 4,
				},
				default: '',
				description: 'Summary of the check output (Markdown supported)',
			},
			{
				displayName: 'Output Text',
				name: 'outputText',
				type: 'string',
				typeOptions: {
					rows: 4,
				},
				default: '',
				description: 'Detailed text of the check output (Markdown supported)',
			},
			{
				displayName: 'Output Title',
				name: 'outputTitle',
				type: 'string',
				default: '',
				description: 'Title for the check output',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: CHECK_STATUSES.map((s) => ({ name: s.charAt(0).toUpperCase() + s.slice(1), value: s })),
				default: 'running',
				description: 'The status of the check',
			},
		],
	},

	// ----------------------------------
	//         check:rerequest
	// ----------------------------------
	{
		displayName: 'Deployment ID',
		name: 'deploymentId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['check'],
				operation: ['rerequest'],
			},
		},
		description: 'The deployment ID',
	},
	{
		displayName: 'Check ID',
		name: 'checkId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['check'],
				operation: ['rerequest'],
			},
		},
		description: 'The check ID to re-request',
	},
];

export async function executeCheckOperation(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<INodeExecutionData[]> {
	let responseData: IDataObject | IDataObject[];

	if (operation === 'create') {
		const deploymentId = this.getNodeParameter('deploymentId', i) as string;
		const name = this.getNodeParameter('name', i) as string;
		const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

		const body: IDataObject = {
			name,
		};

		if (additionalFields.blocking !== undefined) {
			body.blocking = additionalFields.blocking;
		}
		if (additionalFields.detailsUrl) {
			body.detailsUrl = additionalFields.detailsUrl;
		}
		if (additionalFields.externalId) {
			body.externalId = additionalFields.externalId;
		}
		if (additionalFields.path) {
			body.path = additionalFields.path;
		}
		if (additionalFields.rerequestable !== undefined) {
			body.rerequestable = additionalFields.rerequestable;
		}

		responseData = await vercelApiRequest.call(
			this,
			'POST',
			`/v1/deployments/${encodeURIComponent(deploymentId)}/checks`,
			body,
		);
	} else if (operation === 'get') {
		const deploymentId = this.getNodeParameter('deploymentId', i) as string;
		const checkId = this.getNodeParameter('checkId', i) as string;

		responseData = await vercelApiRequest.call(
			this,
			'GET',
			`/v1/deployments/${encodeURIComponent(deploymentId)}/checks/${encodeURIComponent(checkId)}`,
		);
	} else if (operation === 'getAll') {
		const deploymentId = this.getNodeParameter('deploymentId', i) as string;
		const returnAll = this.getNodeParameter('returnAll', i) as boolean;

		if (returnAll) {
			responseData = await vercelApiRequestAllItems.call(
				this,
				'GET',
				`/v1/deployments/${encodeURIComponent(deploymentId)}/checks`,
				'checks',
				{},
				{},
			);
		} else {
			const limit = this.getNodeParameter('limit', i) as number;
			const response = await vercelApiRequest.call(
				this,
				'GET',
				`/v1/deployments/${encodeURIComponent(deploymentId)}/checks`,
				{},
				{ limit },
			) as IDataObject;
			responseData = (response.checks as IDataObject[]) || [];
		}
	} else if (operation === 'update') {
		const deploymentId = this.getNodeParameter('deploymentId', i) as string;
		const checkId = this.getNodeParameter('checkId', i) as string;
		const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;

		const body: IDataObject = {};

		if (updateFields.status) {
			body.status = updateFields.status;
		}
		if (updateFields.conclusion) {
			body.conclusion = updateFields.conclusion;
		}
		if (updateFields.detailsUrl) {
			body.detailsUrl = updateFields.detailsUrl;
		}
		if (updateFields.externalId) {
			body.externalId = updateFields.externalId;
		}

		// Build output object if any output fields are provided
		if (updateFields.outputTitle || updateFields.outputSummary || updateFields.outputText) {
			body.output = {};
			if (updateFields.outputTitle) {
				(body.output as IDataObject).title = updateFields.outputTitle;
			}
			if (updateFields.outputSummary) {
				(body.output as IDataObject).summary = updateFields.outputSummary;
			}
			if (updateFields.outputText) {
				(body.output as IDataObject).text = updateFields.outputText;
			}
		}

		responseData = await vercelApiRequest.call(
			this,
			'PATCH',
			`/v1/deployments/${encodeURIComponent(deploymentId)}/checks/${encodeURIComponent(checkId)}`,
			body,
		);
	} else if (operation === 'rerequest') {
		const deploymentId = this.getNodeParameter('deploymentId', i) as string;
		const checkId = this.getNodeParameter('checkId', i) as string;

		responseData = await vercelApiRequest.call(
			this,
			'POST',
			`/v1/deployments/${encodeURIComponent(deploymentId)}/checks/${encodeURIComponent(checkId)}/rerequest`,
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
