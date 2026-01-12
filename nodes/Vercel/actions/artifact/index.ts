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
import { vercelApiRequest } from '../../transport/api';

export const artifactOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['artifact'],
			},
		},
		options: [
			{
				name: 'Check Exists',
				value: 'exists',
				description: 'Check if an artifact exists',
				action: 'Check if artifact exists',
			},
			{
				name: 'Download',
				value: 'get',
				description: 'Download an artifact',
				action: 'Download an artifact',
			},
			{
				name: 'Query',
				value: 'query',
				description: 'Query artifact status',
				action: 'Query artifact status',
			},
			{
				name: 'Record Event',
				value: 'recordEvent',
				description: 'Record an artifact cache event',
				action: 'Record artifact event',
			},
		],
		default: 'exists',
	},
];

export const artifactFields: INodeProperties[] = [
	// ----------------------------------
	//         artifact:exists
	// ----------------------------------
	{
		displayName: 'Hash',
		name: 'hash',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['artifact'],
				operation: ['exists'],
			},
		},
		description: 'The artifact hash (SHA-256)',
	},

	// ----------------------------------
	//         artifact:get
	// ----------------------------------
	{
		displayName: 'Hash',
		name: 'hash',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['artifact'],
				operation: ['get'],
			},
		},
		description: 'The artifact hash (SHA-256)',
	},

	// ----------------------------------
	//         artifact:query
	// ----------------------------------
	{
		displayName: 'Hashes',
		name: 'hashes',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['artifact'],
				operation: ['query'],
			},
		},
		description: 'Comma-separated list of artifact hashes to query',
	},

	// ----------------------------------
	//         artifact:recordEvent
	// ----------------------------------
	{
		displayName: 'Events',
		name: 'events',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		required: true,
		default: {},
		displayOptions: {
			show: {
				resource: ['artifact'],
				operation: ['recordEvent'],
			},
		},
		options: [
			{
				name: 'event',
				displayName: 'Event',
				values: [
					{
						displayName: 'Session ID',
						name: 'sessionId',
						type: 'string',
						default: '',
						description: 'The session ID for this event',
					},
					{
						displayName: 'Source',
						name: 'source',
						type: 'options',
						options: [
							{ name: 'Local', value: 'LOCAL' },
							{ name: 'Remote', value: 'REMOTE' },
						],
						default: 'LOCAL',
						description: 'Where the artifact was retrieved from',
					},
					{
						displayName: 'Event Type',
						name: 'event',
						type: 'options',
						options: [
							{ name: 'Hit', value: 'HIT' },
							{ name: 'Miss', value: 'MISS' },
						],
						default: 'HIT',
						description: 'Whether the artifact was found',
					},
					{
						displayName: 'Hash',
						name: 'hash',
						type: 'string',
						default: '',
						description: 'The artifact hash',
					},
					{
						displayName: 'Duration',
						name: 'duration',
						type: 'number',
						default: 0,
						description: 'Duration in milliseconds',
					},
				],
			},
		],
		description: 'Cache usage events to record',
	},
];

export async function executeArtifactOperation(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<INodeExecutionData[]> {
	let responseData: IDataObject | IDataObject[];

	if (operation === 'exists') {
		const hash = this.getNodeParameter('hash', i) as string;

		try {
			responseData = await vercelApiRequest.call(
				this,
				'HEAD',
				`/v8/artifacts/${encodeURIComponent(hash)}`,
			);
			responseData = { exists: true, hash };
		} catch (error: unknown) {
			// 404 means artifact doesn't exist
			const err = error as { httpCode?: number };
			if (err.httpCode === 404) {
				responseData = { exists: false, hash };
			} else {
				throw error;
			}
		}
	} else if (operation === 'get') {
		const hash = this.getNodeParameter('hash', i) as string;

		// Note: This returns binary data, but we'll return metadata
		// The actual download would need binary handling
		responseData = await vercelApiRequest.call(
			this,
			'GET',
			`/v8/artifacts/${encodeURIComponent(hash)}`,
		);
	} else if (operation === 'query') {
		const hashesStr = this.getNodeParameter('hashes', i) as string;
		const hashes = hashesStr.split(',').map((h) => h.trim()).filter((h) => h);

		responseData = await vercelApiRequest.call(
			this,
			'POST',
			'/v8/artifacts',
			{ hashes },
		);
	} else if (operation === 'recordEvent') {
		const eventsData = this.getNodeParameter('events', i) as IDataObject;
		const events: IDataObject[] = [];

		if (eventsData.event && Array.isArray(eventsData.event)) {
			for (const event of eventsData.event as IDataObject[]) {
				events.push({
					sessionId: event.sessionId,
					source: event.source,
					event: event.event,
					hash: event.hash,
					duration: event.duration,
				});
			}
		}

		responseData = await vercelApiRequest.call(
			this,
			'POST',
			'/v8/artifacts/events',
			{ events },
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
