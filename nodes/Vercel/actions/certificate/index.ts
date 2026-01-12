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

export const certificateOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['certificate'],
			},
		},
		options: [
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete/revoke a certificate',
				action: 'Delete a certificate',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get certificate details',
				action: 'Get a certificate',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many certificates',
				action: 'Get many certificates',
			},
			{
				name: 'Issue',
				value: 'issue',
				description: 'Issue a new certificate',
				action: 'Issue a certificate',
			},
			{
				name: 'Upload',
				value: 'upload',
				description: 'Upload a custom certificate',
				action: 'Upload a certificate',
			},
		],
		default: 'getAll',
	},
];

export const certificateFields: INodeProperties[] = [
	// ----------------------------------
	//         certificate:get
	// ----------------------------------
	{
		displayName: 'Certificate ID',
		name: 'certificateId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['certificate'],
				operation: ['get'],
			},
		},
		description: 'The ID of the certificate to retrieve',
	},

	// ----------------------------------
	//         certificate:getAll
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['certificate'],
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
				resource: ['certificate'],
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
	//         certificate:issue
	// ----------------------------------
	{
		displayName: 'Domains',
		name: 'domains',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['certificate'],
				operation: ['issue'],
			},
		},
		description: 'Comma-separated list of domains for the certificate',
	},

	// ----------------------------------
	//         certificate:delete
	// ----------------------------------
	{
		displayName: 'Certificate ID',
		name: 'certificateId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['certificate'],
				operation: ['delete'],
			},
		},
		description: 'The ID of the certificate to delete',
	},

	// ----------------------------------
	//         certificate:upload
	// ----------------------------------
	{
		displayName: 'Certificate (PEM)',
		name: 'cert',
		type: 'string',
		typeOptions: {
			rows: 10,
		},
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['certificate'],
				operation: ['upload'],
			},
		},
		description: 'The certificate content in PEM format',
	},
	{
		displayName: 'Private Key (PEM)',
		name: 'key',
		type: 'string',
		typeOptions: {
			password: true,
			rows: 10,
		},
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['certificate'],
				operation: ['upload'],
			},
		},
		description: 'The private key in PEM format',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['certificate'],
				operation: ['upload'],
			},
		},
		options: [
			{
				displayName: 'CA Certificate (PEM)',
				name: 'ca',
				type: 'string',
				typeOptions: {
					rows: 10,
				},
				default: '',
				description: 'The CA certificate chain in PEM format',
			},
			{
				displayName: 'Skip Validation',
				name: 'skipValidation',
				type: 'boolean',
				default: false,
				description: 'Whether to skip certificate validation',
			},
		],
	},
];

export async function executeCertificateOperation(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<INodeExecutionData[]> {
	let responseData: IDataObject | IDataObject[];

	if (operation === 'get') {
		const certificateId = this.getNodeParameter('certificateId', i) as string;

		responseData = await vercelApiRequest.call(
			this,
			'GET',
			`/v7/certs/${encodeURIComponent(certificateId)}`,
		);
	} else if (operation === 'getAll') {
		const returnAll = this.getNodeParameter('returnAll', i) as boolean;

		if (returnAll) {
			responseData = await vercelApiRequestAllItems.call(
				this,
				'GET',
				'/v7/certs',
				'certs',
				{},
				{},
			);
		} else {
			const limit = this.getNodeParameter('limit', i) as number;
			const response = await vercelApiRequest.call(this, 'GET', '/v7/certs', {}, { limit }) as IDataObject;
			responseData = (response.certs as IDataObject[]) || [];
		}
	} else if (operation === 'issue') {
		const domainsStr = this.getNodeParameter('domains', i) as string;
		const domains = domainsStr.split(',').map((d) => d.trim());

		responseData = await vercelApiRequest.call(this, 'POST', '/v7/certs', {
			domains,
		});
	} else if (operation === 'delete') {
		const certificateId = this.getNodeParameter('certificateId', i) as string;

		responseData = await vercelApiRequest.call(
			this,
			'DELETE',
			`/v7/certs/${encodeURIComponent(certificateId)}`,
		);
	} else if (operation === 'upload') {
		const cert = this.getNodeParameter('cert', i) as string;
		const key = this.getNodeParameter('key', i) as string;
		const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

		const body: IDataObject = {
			cert,
			key,
		};

		if (additionalFields.ca) {
			body.ca = additionalFields.ca;
		}
		if (additionalFields.skipValidation) {
			body.skipValidation = additionalFields.skipValidation;
		}

		responseData = await vercelApiRequest.call(this, 'PUT', '/v7/certs', body);
	} else {
		throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
	}

	const executionData = this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray(responseData),
		{ itemData: { item: i } },
	);

	return executionData;
}
