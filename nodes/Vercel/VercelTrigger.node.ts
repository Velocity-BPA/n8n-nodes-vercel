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
	IHookFunctions,
	IWebhookFunctions,
	IDataObject,
	INodeType,
	INodeTypeDescription,
	IWebhookResponseData,
} from 'n8n-workflow';

import * as crypto from 'crypto';
import { logLicensingNotice, VERCEL_WEBHOOK_EVENTS } from './constants/constants';
import { vercelApiRequest } from './transport/api';

export class VercelTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Vercel Trigger',
		name: 'vercelTrigger',
		icon: 'file:vercel.svg',
		group: ['trigger'],
		version: 1,
		subtitle: '={{$parameter["events"].join(", ")}}',
		description: 'Starts the workflow when Vercel events occur',
		defaults: {
			name: 'Vercel Trigger',
		},
		inputs: [],
		outputs: ['main'],
		credentials: [
			{
				name: 'vercelApi',
				required: true,
			},
		],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
			},
		],
		properties: [
			{
				displayName: 'Events',
				name: 'events',
				type: 'multiOptions',
				options: VERCEL_WEBHOOK_EVENTS.map((event) => ({
					name: event.name,
					value: event.value,
				})),
				default: ['deployment.succeeded'],
				required: true,
				description: 'The events to listen for',
			},
			{
				displayName: 'Options',
				name: 'options',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				options: [
					{
						displayName: 'Project IDs',
						name: 'projectIds',
						type: 'string',
						default: '',
						placeholder: 'prj_xxx, prj_yyy',
						description: 'Comma-separated list of project IDs to filter events (leave empty for all projects)',
					},
					{
						displayName: 'Webhook Secret',
						name: 'webhookSecret',
						type: 'string',
						typeOptions: {
							password: true,
						},
						default: '',
						description: 'Secret used to verify webhook signatures (auto-generated if empty)',
					},
				],
			},
		],
	};

	constructor() {
		logLicensingNotice();
	}

	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node');

				if (webhookData.webhookId === undefined) {
					return false;
				}

				try {
					await vercelApiRequest.call(
						this,
						'GET',
						`/v1/webhooks/${webhookData.webhookId}`,
					);
					return true;
				} catch {
					return false;
				}
			},

			async create(this: IHookFunctions): Promise<boolean> {
				const webhookUrl = this.getNodeWebhookUrl('default');
				const events = this.getNodeParameter('events') as string[];
				const options = this.getNodeParameter('options') as IDataObject;

				const body: IDataObject = {
					url: webhookUrl,
					events,
				};

				// Add project filter if specified
				if (options.projectIds) {
					const projectIds = (options.projectIds as string)
						.split(',')
						.map((id) => id.trim())
						.filter((id) => id);
					if (projectIds.length > 0) {
						body.projectIds = projectIds;
					}
				}

				const responseData = await vercelApiRequest.call(
					this,
					'POST',
					'/v1/webhooks',
					body,
				) as IDataObject;

				if (responseData.id === undefined) {
					return false;
				}

				const webhookData = this.getWorkflowStaticData('node');
				webhookData.webhookId = responseData.id;
				webhookData.webhookSecret = responseData.secret;

				return true;
			},

			async delete(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node');

				if (webhookData.webhookId !== undefined) {
					try {
						await vercelApiRequest.call(
							this,
							'DELETE',
							`/v1/webhooks/${webhookData.webhookId}`,
						);
					} catch {
						return false;
					}

					delete webhookData.webhookId;
					delete webhookData.webhookSecret;
				}

				return true;
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const body = this.getBodyData();
		const headers = this.getHeaderData() as IDataObject;

		// Get webhook secret for verification
		const webhookData = this.getWorkflowStaticData('node');
		const options = this.getNodeParameter('options') as IDataObject;
		const webhookSecret = (options.webhookSecret as string) || (webhookData.webhookSecret as string);

		// Verify webhook signature if secret is available
		if (webhookSecret && headers['x-vercel-signature']) {
			const signature = headers['x-vercel-signature'] as string;
			const rawBody = JSON.stringify(body);

			const expectedSignature = crypto
				.createHmac('sha1', webhookSecret)
				.update(rawBody)
				.digest('hex');

			if (signature !== expectedSignature) {
				return {
					webhookResponse: 'Invalid signature',
				};
			}
		}

		// Extract event type from payload
		const eventType = body.type as string;
		const payload = body.payload as IDataObject;

		return {
			workflowData: [
				this.helpers.returnJsonArray({
					event: eventType,
					...payload,
					_timestamp: body.createdAt,
					_webhookId: body.id,
				}),
			],
		};
	}
}
