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

import { Vercel } from '../../nodes/Vercel/Vercel.node';
import { VercelTrigger } from '../../nodes/Vercel/VercelTrigger.node';
import {
	VERCEL_API_BASE_URL,
	VERCEL_FRAMEWORKS,
	VERCEL_NODE_VERSIONS,
	VERCEL_DEPLOYMENT_STATES,
	VERCEL_ENV_VARIABLE_TYPES,
	VERCEL_ENV_VARIABLE_TARGETS,
	VERCEL_TEAM_ROLES,
	CHECK_STATUSES,
	CHECK_CONCLUSIONS,
	DNS_RECORD_TYPES,
	LOG_DRAIN_TYPES,
	LOG_DRAIN_SOURCES,
	VERCEL_WEBHOOK_EVENTS,
	VERCEL_REGIONS,
	REDIRECT_STATUS_CODES,
} from '../../nodes/Vercel/constants/constants';

describe('Vercel Node', () => {
	let vercelNode: Vercel;

	beforeEach(() => {
		vercelNode = new Vercel();
	});

	describe('Node Description', () => {
		it('should have correct display name', () => {
			expect(vercelNode.description.displayName).toBe('Vercel');
		});

		it('should have correct name', () => {
			expect(vercelNode.description.name).toBe('vercel');
		});

		it('should have correct icon', () => {
			expect(vercelNode.description.icon).toBe('file:vercel.svg');
		});

		it('should require vercelApi credentials', () => {
			const credentials = vercelNode.description.credentials;
			expect(credentials).toBeDefined();
			expect(credentials).toHaveLength(1);
			expect(credentials![0].name).toBe('vercelApi');
			expect(credentials![0].required).toBe(true);
		});

		it('should have all 12 resources defined', () => {
			const resourceProperty = vercelNode.description.properties.find(
				(p) => p.name === 'resource'
			);
			expect(resourceProperty).toBeDefined();
			expect(resourceProperty?.type).toBe('options');

			const options = (resourceProperty as any).options;
			expect(options).toHaveLength(12);

			const resourceNames = options.map((o: any) => o.value);
			expect(resourceNames).toContain('project');
			expect(resourceNames).toContain('deployment');
			expect(resourceNames).toContain('domain');
			expect(resourceNames).toContain('environmentVariable');
			expect(resourceNames).toContain('team');
			expect(resourceNames).toContain('secret');
			expect(resourceNames).toContain('check');
			expect(resourceNames).toContain('certificate');
			expect(resourceNames).toContain('webhook');
			expect(resourceNames).toContain('logDrain');
			expect(resourceNames).toContain('edgeConfig');
			expect(resourceNames).toContain('artifact');
		});
	});
});

describe('VercelTrigger Node', () => {
	let vercelTrigger: VercelTrigger;

	beforeEach(() => {
		vercelTrigger = new VercelTrigger();
	});

	describe('Node Description', () => {
		it('should have correct display name', () => {
			expect(vercelTrigger.description.displayName).toBe('Vercel Trigger');
		});

		it('should have correct name', () => {
			expect(vercelTrigger.description.name).toBe('vercelTrigger');
		});

		it('should be in trigger group', () => {
			expect(vercelTrigger.description.group).toContain('trigger');
		});

		it('should have no inputs', () => {
			expect(vercelTrigger.description.inputs).toHaveLength(0);
		});

		it('should have webhook configuration', () => {
			expect(vercelTrigger.description.webhooks).toBeDefined();
			expect(vercelTrigger.description.webhooks).toHaveLength(1);
			expect(vercelTrigger.description.webhooks![0].httpMethod).toBe('POST');
		});

		it('should have events property with all webhook events', () => {
			const eventsProperty = vercelTrigger.description.properties.find(
				(p) => p.name === 'events'
			);
			expect(eventsProperty).toBeDefined();
			expect(eventsProperty?.type).toBe('multiOptions');
		});
	});
});

describe('Constants', () => {
	describe('API Configuration', () => {
		it('should have correct base URL', () => {
			expect(VERCEL_API_BASE_URL).toBe('https://api.vercel.com');
		});
	});

	describe('Framework Options', () => {
		it('should have multiple frameworks defined', () => {
			expect(VERCEL_FRAMEWORKS.length).toBeGreaterThan(10);
		});

		it('should include nextjs framework', () => {
			const nextjs = VERCEL_FRAMEWORKS.find((f) => f.value === 'nextjs');
			expect(nextjs).toBeDefined();
			expect(nextjs?.name).toBe('Next.js');
		});

		it('should include nuxtjs framework', () => {
			const nuxtjs = VERCEL_FRAMEWORKS.find((f) => f.value === 'nuxtjs');
			expect(nuxtjs).toBeDefined();
		});
	});

	describe('Node Versions', () => {
		it('should have node versions defined', () => {
			expect(VERCEL_NODE_VERSIONS.length).toBeGreaterThan(0);
		});

		it('should include 20.x LTS', () => {
			const v20 = VERCEL_NODE_VERSIONS.find((v) => v.value === '20.x');
			expect(v20).toBeDefined();
		});
	});

	describe('Deployment States', () => {
		it('should have deployment states defined', () => {
			expect(VERCEL_DEPLOYMENT_STATES.length).toBeGreaterThan(0);
		});

		it('should include READY state', () => {
			const ready = VERCEL_DEPLOYMENT_STATES.find((s) => s.value === 'READY');
			expect(ready).toBeDefined();
		});

		it('should include ERROR state', () => {
			const error = VERCEL_DEPLOYMENT_STATES.find((s) => s.value === 'ERROR');
			expect(error).toBeDefined();
		});
	});

	describe('Environment Variable Types', () => {
		it('should have env variable types', () => {
			expect(VERCEL_ENV_VARIABLE_TYPES.length).toBe(4);
		});

		it('should include plain type', () => {
			const plain = VERCEL_ENV_VARIABLE_TYPES.find((t) => t.value === 'plain');
			expect(plain).toBeDefined();
		});

		it('should include encrypted type', () => {
			const encrypted = VERCEL_ENV_VARIABLE_TYPES.find((t) => t.value === 'encrypted');
			expect(encrypted).toBeDefined();
		});
	});

	describe('Environment Variable Targets', () => {
		it('should have 3 targets', () => {
			expect(VERCEL_ENV_VARIABLE_TARGETS.length).toBe(3);
		});

		it('should include production target', () => {
			const production = VERCEL_ENV_VARIABLE_TARGETS.find((t) => t.value === 'production');
			expect(production).toBeDefined();
		});
	});

	describe('Team Roles', () => {
		it('should have team roles defined', () => {
			expect(VERCEL_TEAM_ROLES.length).toBeGreaterThan(0);
		});

		it('should include OWNER role', () => {
			const owner = VERCEL_TEAM_ROLES.find((r) => r.value === 'OWNER');
			expect(owner).toBeDefined();
		});
	});

	describe('Check Statuses', () => {
		it('should have check statuses', () => {
			expect(CHECK_STATUSES.length).toBeGreaterThan(0);
		});

		it('should include completed status', () => {
			expect(CHECK_STATUSES).toContain('completed');
		});
	});

	describe('Check Conclusions', () => {
		it('should have check conclusions', () => {
			expect(CHECK_CONCLUSIONS.length).toBeGreaterThan(0);
		});

		it('should include succeeded conclusion', () => {
			expect(CHECK_CONCLUSIONS).toContain('succeeded');
		});
	});

	describe('DNS Record Types', () => {
		it('should have DNS record types', () => {
			expect(DNS_RECORD_TYPES.length).toBeGreaterThan(0);
		});

		it('should include A record type', () => {
			const aRecord = DNS_RECORD_TYPES.find((t) => t.value === 'A');
			expect(aRecord).toBeDefined();
		});

		it('should include CNAME record type', () => {
			const cname = DNS_RECORD_TYPES.find((t) => t.value === 'CNAME');
			expect(cname).toBeDefined();
		});
	});

	describe('Log Drain Types', () => {
		it('should have log drain types', () => {
			expect(LOG_DRAIN_TYPES.length).toBeGreaterThan(0);
		});

		it('should include json type', () => {
			const json = LOG_DRAIN_TYPES.find((t) => t.value === 'json');
			expect(json).toBeDefined();
		});
	});

	describe('Log Drain Sources', () => {
		it('should have log drain sources', () => {
			expect(LOG_DRAIN_SOURCES.length).toBeGreaterThan(0);
		});

		it('should include lambda source', () => {
			const lambda = LOG_DRAIN_SOURCES.find((s) => s.value === 'lambda');
			expect(lambda).toBeDefined();
		});
	});

	describe('Webhook Events', () => {
		it('should have webhook events', () => {
			expect(VERCEL_WEBHOOK_EVENTS.length).toBeGreaterThan(0);
		});

		it('should include deployment.succeeded', () => {
			const event = VERCEL_WEBHOOK_EVENTS.find((e) => e.value === 'deployment.succeeded');
			expect(event).toBeDefined();
		});

		it('should include deployment.failed', () => {
			const event = VERCEL_WEBHOOK_EVENTS.find((e) => e.value === 'deployment.failed');
			expect(event).toBeDefined();
		});
	});

	describe('Regions', () => {
		it('should have regions defined', () => {
			expect(VERCEL_REGIONS.length).toBeGreaterThan(0);
		});

		it('should include US East region', () => {
			const usEast = VERCEL_REGIONS.find((r) => r.value === 'iad1');
			expect(usEast).toBeDefined();
		});
	});

	describe('Redirect Status Codes', () => {
		it('should have redirect status codes', () => {
			expect(REDIRECT_STATUS_CODES.length).toBe(4);
		});

		it('should include 301 redirect', () => {
			const redirect301 = REDIRECT_STATUS_CODES.find((c) => c.value === 301);
			expect(redirect301).toBeDefined();
		});
	});
});
