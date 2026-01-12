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
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

import { logLicensingNotice } from './constants/constants';

// Import project descriptions and operations
import { projectOperations as projectOps, projectFields } from './actions/project/project.description';
import * as projectOperations from './actions/project/project.operations';

// Import deployment descriptions and operations
import { deploymentOperations as deploymentOps, deploymentFields } from './actions/deployment/deployment.description';
import * as deploymentOperations from './actions/deployment/deployment.operations';

// Import domain descriptions and operations
import { domainOperations as domainOps, domainFields } from './actions/domain/domain.description';
import * as domainOperations from './actions/domain/domain.operations';

// Import environment variable descriptions and operations
import { environmentVariableOperations as envVarOps, environmentVariableFields } from './actions/environmentVariable/environmentVariable.description';
import * as environmentVariableOperations from './actions/environmentVariable/environmentVariable.operations';

// Import team descriptions and operations
import { teamOperations as teamOps, teamFields } from './actions/team/team.description';
import * as teamOperations from './actions/team/team.operations';

// Import new resources with combined structure
import { secretOperations, secretFields, executeSecretOperation } from './actions/secret';
import { checkOperations, checkFields, executeCheckOperation } from './actions/check';
import { certificateOperations, certificateFields, executeCertificateOperation } from './actions/certificate';
import { webhookOperations, webhookFields, executeWebhookOperation } from './actions/webhook';
import { logDrainOperations, logDrainFields, executeLogDrainOperation } from './actions/logDrain';
import { edgeConfigOperations, edgeConfigFields, executeEdgeConfigOperation } from './actions/edgeConfig';
import { artifactOperations, artifactFields, executeArtifactOperation } from './actions/artifact';

export class Vercel implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Vercel',
		name: 'vercel',
		icon: 'file:vercel.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with Vercel API for deployments, projects, domains, and more',
		defaults: {
			name: 'Vercel',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'vercelApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Artifact',
						value: 'artifact',
					},
					{
						name: 'Certificate',
						value: 'certificate',
					},
					{
						name: 'Check',
						value: 'check',
					},
					{
						name: 'Deployment',
						value: 'deployment',
					},
					{
						name: 'Domain',
						value: 'domain',
					},
					{
						name: 'Edge Config',
						value: 'edgeConfig',
					},
					{
						name: 'Environment Variable',
						value: 'environmentVariable',
					},
					{
						name: 'Log Drain',
						value: 'logDrain',
					},
					{
						name: 'Project',
						value: 'project',
					},
					{
						name: 'Secret',
						value: 'secret',
					},
					{
						name: 'Team',
						value: 'team',
					},
					{
						name: 'Webhook',
						value: 'webhook',
					},
				],
				default: 'project',
			},
			// Project operations and fields
			...projectOps,
			...projectFields,
			// Deployment operations and fields
			...deploymentOps,
			...deploymentFields,
			// Domain operations and fields
			...domainOps,
			...domainFields,
			// Environment Variable operations and fields
			...envVarOps,
			...environmentVariableFields,
			// Team operations and fields
			...teamOps,
			...teamFields,
			// Secret operations and fields
			...secretOperations,
			...secretFields,
			// Check operations and fields
			...checkOperations,
			...checkFields,
			// Certificate operations and fields
			...certificateOperations,
			...certificateFields,
			// Webhook operations and fields
			...webhookOperations,
			...webhookFields,
			// Log Drain operations and fields
			...logDrainOperations,
			...logDrainFields,
			// Edge Config operations and fields
			...edgeConfigOperations,
			...edgeConfigFields,
			// Artifact operations and fields
			...artifactOperations,
			...artifactFields,
		],
	};

	constructor() {
		logLicensingNotice();
	}

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let result: INodeExecutionData[] = [];

				if (resource === 'project') {
					result = await executeProjectOperation.call(this, operation, i);
				} else if (resource === 'deployment') {
					result = await executeDeploymentOperation.call(this, operation, i);
				} else if (resource === 'domain') {
					result = await executeDomainOperation.call(this, operation, i);
				} else if (resource === 'environmentVariable') {
					result = await executeEnvironmentVariableOperation.call(this, operation, i);
				} else if (resource === 'team') {
					result = await executeTeamOperation.call(this, operation, i);
				} else if (resource === 'secret') {
					result = await executeSecretOperation.call(this, operation, i);
				} else if (resource === 'check') {
					result = await executeCheckOperation.call(this, operation, i);
				} else if (resource === 'certificate') {
					result = await executeCertificateOperation.call(this, operation, i);
				} else if (resource === 'webhook') {
					result = await executeWebhookOperation.call(this, operation, i);
				} else if (resource === 'logDrain') {
					result = await executeLogDrainOperation.call(this, operation, i);
				} else if (resource === 'edgeConfig') {
					result = await executeEdgeConfigOperation.call(this, operation, i);
				} else if (resource === 'artifact') {
					result = await executeArtifactOperation.call(this, operation, i);
				}

				returnData.push(...result);
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: { error: (error as Error).message },
						pairedItem: { item: i },
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}

async function executeProjectOperation(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<INodeExecutionData[]> {
	switch (operation) {
		case 'create':
			return projectOperations.create.call(this, i);
		case 'get':
			return projectOperations.get.call(this, i);
		case 'getAll':
			return projectOperations.getAll.call(this, i);
		case 'update':
			return projectOperations.update.call(this, i);
		case 'delete':
			return projectOperations.deleteProject.call(this, i);
		case 'addDomain':
			return projectOperations.addDomain.call(this, i);
		case 'removeDomain':
			return projectOperations.removeDomain.call(this, i);
		case 'getProductionDeployment':
			return projectOperations.getProductionDeployment.call(this, i);
		case 'linkGitRepository':
			return projectOperations.linkGitRepository.call(this, i);
		case 'unlinkGitRepository':
			return projectOperations.unlinkGitRepository.call(this, i);
		case 'pauseProject':
			return projectOperations.pauseProject.call(this, i);
		case 'unpauseProject':
			return projectOperations.unpauseProject.call(this, i);
		default:
			throw new Error(`Unknown project operation: ${operation}`);
	}
}

async function executeDeploymentOperation(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<INodeExecutionData[]> {
	switch (operation) {
		case 'create':
			return deploymentOperations.create.call(this, i);
		case 'get':
			return deploymentOperations.get.call(this, i);
		case 'getAll':
			return deploymentOperations.getAll.call(this, i);
		case 'delete':
			return deploymentOperations.deleteDeployment.call(this, i);
		case 'getEvents':
			return deploymentOperations.getEvents.call(this, i);
		case 'getFiles':
			return deploymentOperations.getFiles.call(this, i);
		case 'getFileContents':
			return deploymentOperations.getFileContents.call(this, i);
		case 'redeploy':
			return deploymentOperations.redeploy.call(this, i);
		case 'promote':
			return deploymentOperations.promote.call(this, i);
		case 'rollback':
			return deploymentOperations.rollback.call(this, i);
		default:
			throw new Error(`Unknown deployment operation: ${operation}`);
	}
}

async function executeDomainOperation(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<INodeExecutionData[]> {
	switch (operation) {
		case 'create':
			return domainOperations.create.call(this, i);
		case 'get':
			return domainOperations.get.call(this, i);
		case 'getAll':
			return domainOperations.getAll.call(this, i);
		case 'delete':
			return domainOperations.deleteDomain.call(this, i);
		case 'verify':
			return domainOperations.verify.call(this, i);
		case 'getConfig':
			return domainOperations.getConfig.call(this, i);
		case 'checkAvailability':
			return domainOperations.checkAvailability.call(this, i);
		case 'purchase':
			return domainOperations.purchase.call(this, i);
		case 'transferIn':
			return domainOperations.transferIn.call(this, i);
		case 'getDnsRecords':
			return domainOperations.getDnsRecords.call(this, i);
		case 'createDnsRecord':
			return domainOperations.createDnsRecord.call(this, i);
		case 'deleteDnsRecord':
			return domainOperations.deleteDnsRecord.call(this, i);
		default:
			throw new Error(`Unknown domain operation: ${operation}`);
	}
}

async function executeEnvironmentVariableOperation(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<INodeExecutionData[]> {
	switch (operation) {
		case 'create':
			return environmentVariableOperations.create.call(this, i);
		case 'get':
			return environmentVariableOperations.get.call(this, i);
		case 'getAll':
			return environmentVariableOperations.getAll.call(this, i);
		case 'update':
			return environmentVariableOperations.update.call(this, i);
		case 'delete':
			return environmentVariableOperations.deleteEnv.call(this, i);
		case 'bulkCreate':
			return environmentVariableOperations.bulkCreate.call(this, i);
		case 'bulkDelete':
			return environmentVariableOperations.bulkDelete.call(this, i);
		default:
			throw new Error(`Unknown environmentVariable operation: ${operation}`);
	}
}

async function executeTeamOperation(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<INodeExecutionData[]> {
	switch (operation) {
		case 'get':
			return teamOperations.get.call(this, i);
		case 'getAll':
			return teamOperations.getAll.call(this, i);
		case 'update':
			return teamOperations.update.call(this, i);
		case 'delete':
			return teamOperations.deleteTeam.call(this, i);
		case 'getMembers':
			return teamOperations.getMembers.call(this, i);
		case 'inviteMember':
			return teamOperations.inviteMember.call(this, i);
		case 'removeMember':
			return teamOperations.removeMember.call(this, i);
		case 'updateMemberRole':
			return teamOperations.updateMemberRole.call(this, i);
		case 'getInvites':
			return teamOperations.getInvites.call(this, i);
		case 'deleteInvite':
			return teamOperations.deleteInvite.call(this, i);
		default:
			throw new Error(`Unknown team operation: ${operation}`);
	}
}
