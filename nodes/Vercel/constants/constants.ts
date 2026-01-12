/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

export const VERCEL_API_BASE_URL = 'https://api.vercel.com';

export const VERCEL_API_VERSION = {
  DEPLOYMENTS: 'v13',
  PROJECTS: 'v10',
  DOMAINS: 'v5',
  ENVIRONMENT_VARIABLES: 'v10',
  TEAMS: 'v2',
  SECRETS: 'v3',
  CHECKS: 'v1',
  CERTIFICATES: 'v7',
  WEBHOOKS: 'v1',
  LOG_DRAINS: 'v1',
  EDGE_CONFIG: 'v1',
  ARTIFACTS: 'v8',
  USER: 'v2',
};

export const VERCEL_FRAMEWORKS = [
  { name: 'Next.js', value: 'nextjs' },
  { name: 'Nuxt.js', value: 'nuxtjs' },
  { name: 'Gatsby', value: 'gatsby' },
  { name: 'Remix', value: 'remix' },
  { name: 'Astro', value: 'astro' },
  { name: 'SvelteKit', value: 'sveltekit' },
  { name: 'SolidStart', value: 'solidstart' },
  { name: 'Qwik', value: 'qwik' },
  { name: 'Vue.js', value: 'vue' },
  { name: 'Angular', value: 'angular' },
  { name: 'Ember', value: 'ember' },
  { name: 'Hugo', value: 'hugo' },
  { name: 'Jekyll', value: 'jekyll' },
  { name: 'Eleventy', value: 'eleventy' },
  { name: 'Hexo', value: 'hexo' },
  { name: 'Docusaurus', value: 'docusaurus' },
  { name: 'Blitz.js', value: 'blitzjs' },
  { name: 'RedwoodJS', value: 'redwoodjs' },
  { name: 'Hydrogen', value: 'hydrogen' },
  { name: 'Vite', value: 'vite' },
  { name: 'Parcel', value: 'parcel' },
  { name: 'Create React App', value: 'create-react-app' },
  { name: 'Static HTML', value: 'static' },
  { name: 'Other', value: 'other' },
];

export const VERCEL_NODE_VERSIONS = [
  { name: '22.x', value: '22.x' },
  { name: '20.x (LTS)', value: '20.x' },
  { name: '18.x (LTS)', value: '18.x' },
];

export const VERCEL_DEPLOYMENT_TARGETS = [
  { name: 'Production', value: 'production' },
  { name: 'Preview', value: 'preview' },
];

export const VERCEL_DEPLOYMENT_STATES = [
  { name: 'Building', value: 'BUILDING' },
  { name: 'Error', value: 'ERROR' },
  { name: 'Initializing', value: 'INITIALIZING' },
  { name: 'Queued', value: 'QUEUED' },
  { name: 'Ready', value: 'READY' },
  { name: 'Canceled', value: 'CANCELED' },
];

export const VERCEL_ENV_VARIABLE_TARGETS = [
  { name: 'Production', value: 'production' },
  { name: 'Preview', value: 'preview' },
  { name: 'Development', value: 'development' },
];

export const VERCEL_ENV_VARIABLE_TYPES = [
  { name: 'Plain', value: 'plain' },
  { name: 'Encrypted', value: 'encrypted' },
  { name: 'Secret', value: 'secret' },
  { name: 'Sensitive', value: 'sensitive' },
];

export const VERCEL_TEAM_ROLES = [
  { name: 'Owner', value: 'OWNER' },
  { name: 'Member', value: 'MEMBER' },
  { name: 'Developer', value: 'DEVELOPER' },
  { name: 'Billing', value: 'BILLING' },
];

export const VERCEL_CHECK_STATUSES = [
  { name: 'Registered', value: 'registered' },
  { name: 'Running', value: 'running' },
  { name: 'Completed', value: 'completed' },
];

export const VERCEL_CHECK_CONCLUSIONS = [
  { name: 'Succeeded', value: 'succeeded' },
  { name: 'Failed', value: 'failed' },
  { name: 'Skipped', value: 'skipped' },
  { name: 'Canceled', value: 'canceled' },
];

export const VERCEL_LOG_DRAIN_TYPES = [
  { name: 'JSON', value: 'json' },
  { name: 'NDJSON', value: 'ndjson' },
  { name: 'Syslog', value: 'syslog' },
];

export const VERCEL_LOG_DRAIN_SOURCES = [
  { name: 'Static', value: 'static' },
  { name: 'Lambda', value: 'lambda' },
  { name: 'Edge', value: 'edge' },
  { name: 'External', value: 'external' },
];

export const VERCEL_REDIRECT_STATUS_CODES = [
  { name: '301 - Permanent Redirect', value: 301 },
  { name: '302 - Temporary Redirect', value: 302 },
  { name: '307 - Temporary Redirect (Preserve Method)', value: 307 },
  { name: '308 - Permanent Redirect (Preserve Method)', value: 308 },
];

export const VERCEL_GIT_PROVIDERS = [
  { name: 'GitHub', value: 'github' },
  { name: 'GitLab', value: 'gitlab' },
  { name: 'Bitbucket', value: 'bitbucket' },
];

export const VERCEL_DNS_RECORD_TYPES = [
  { name: 'A', value: 'A' },
  { name: 'AAAA', value: 'AAAA' },
  { name: 'ALIAS', value: 'ALIAS' },
  { name: 'CAA', value: 'CAA' },
  { name: 'CNAME', value: 'CNAME' },
  { name: 'MX', value: 'MX' },
  { name: 'NS', value: 'NS' },
  { name: 'SRV', value: 'SRV' },
  { name: 'TXT', value: 'TXT' },
];

export const VERCEL_WEBHOOK_EVENTS = [
  { name: 'Deployment Created', value: 'deployment.created' },
  { name: 'Deployment Succeeded', value: 'deployment.succeeded' },
  { name: 'Deployment Failed', value: 'deployment.failed' },
  { name: 'Deployment Canceled', value: 'deployment.canceled' },
  { name: 'Deployment Error', value: 'deployment.error' },
  { name: 'Deployment Check Re-requested', value: 'deployment.check-rerequested' },
  { name: 'Project Created', value: 'project.created' },
  { name: 'Project Removed', value: 'project.removed' },
  { name: 'Domain Created', value: 'domain.created' },
  {
    name: 'Integration Configuration Permission Upgraded',
    value: 'integration-configuration.permission-upgraded',
  },
  { name: 'Integration Configuration Removed', value: 'integration-configuration.removed' },
  {
    name: 'Integration Configuration Scope Change Confirmed',
    value: 'integration-configuration.scope-change-confirmed',
  },
];

export const VERCEL_REGIONS = [
  { name: 'Washington, D.C., USA (iad1)', value: 'iad1' },
  { name: 'San Francisco, USA (sfo1)', value: 'sfo1' },
  { name: 'Portland, USA (pdx1)', value: 'pdx1' },
  { name: 'Cleveland, USA (cle1)', value: 'cle1' },
  { name: 'Dublin, Ireland (dub1)', value: 'dub1' },
  { name: 'London, UK (lhr1)', value: 'lhr1' },
  { name: 'Paris, France (cdg1)', value: 'cdg1' },
  { name: 'Frankfurt, Germany (fra1)', value: 'fra1' },
  { name: 'Stockholm, Sweden (arn1)', value: 'arn1' },
  { name: 'Mumbai, India (bom1)', value: 'bom1' },
  { name: 'Singapore (sin1)', value: 'sin1' },
  { name: 'Hong Kong (hkg1)', value: 'hkg1' },
  { name: 'Tokyo, Japan (hnd1)', value: 'hnd1' },
  { name: 'Sydney, Australia (syd1)', value: 'syd1' },
  { name: 'São Paulo, Brazil (gru1)', value: 'gru1' },
];

export const VERCEL_DEFAULT_PAGINATION_LIMIT = 20;
export const VERCEL_MAX_PAGINATION_LIMIT = 100;

export const VERCEL_RATE_LIMIT_HEADERS = {
  LIMIT: 'x-ratelimit-limit',
  REMAINING: 'x-ratelimit-remaining',
  RESET: 'x-ratelimit-reset',
};

export const VERCEL_RETRY_CONFIG = {
  MAX_RETRIES: 5,
  INITIAL_DELAY_MS: 1000,
  MAX_DELAY_MS: 32000,
  BACKOFF_MULTIPLIER: 2,
};

// String array exports for use in operations
export const CHECK_STATUSES = ['registered', 'running', 'completed'];
export const CHECK_CONCLUSIONS = ['succeeded', 'failed', 'skipped', 'canceled'];
export const DNS_RECORD_TYPES = VERCEL_DNS_RECORD_TYPES;
export const LOG_DRAIN_TYPES = VERCEL_LOG_DRAIN_TYPES;
export const LOG_DRAIN_SOURCES = VERCEL_LOG_DRAIN_SOURCES;
export const REDIRECT_STATUS_CODES = VERCEL_REDIRECT_STATUS_CODES;
export const WEBHOOK_EVENTS = VERCEL_WEBHOOK_EVENTS;

// VERCEL_DEPLOYMENT_STATES as string array for filtering
export const DEPLOYMENT_STATE_VALUES = VERCEL_DEPLOYMENT_STATES.map(s => s.value);

// VERCEL_WEBHOOK_EVENTS as string array
export const WEBHOOK_EVENT_VALUES = VERCEL_WEBHOOK_EVENTS.map(e => e.value);

export const LICENSING_NOTICE = `[Velocity BPA Licensing Notice]

This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).

Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.

For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.`;

let licensingNoticeLogged = false;

export function logLicensingNotice(): void {
  if (!licensingNoticeLogged) {
    console.warn(LICENSING_NOTICE);
    licensingNoticeLogged = true;
  }
}
