/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { IDataObject } from 'n8n-workflow';

export interface IVercelCredentials {
  accessToken: string;
  teamId?: string;
}

export interface IVercelPagination {
  count: number;
  next?: number;
  prev?: number;
}

export interface IVercelResponse<T> {
  [key: string]: T[] | IVercelPagination | undefined;
  pagination?: IVercelPagination;
}

export interface IVercelProject {
  id: string;
  name: string;
  accountId: string;
  createdAt: number;
  updatedAt: number;
  framework?: string;
  devCommand?: string;
  installCommand?: string;
  buildCommand?: string;
  outputDirectory?: string;
  rootDirectory?: string;
  nodeVersion?: string;
  serverlessFunctionRegion?: string;
  latestDeployments?: IVercelDeployment[];
  link?: IVercelGitLink;
}

export interface IVercelGitLink {
  type: 'github' | 'gitlab' | 'bitbucket';
  repo: string;
  repoId: number;
  org?: string;
  gitCredentialId?: string;
  productionBranch?: string;
  sourceless?: boolean;
  createdAt?: number;
  updatedAt?: number;
}

export interface IVercelDeployment {
  uid: string;
  id: string;
  name: string;
  url: string;
  created: number;
  createdAt: number;
  source?: string;
  state: 'BUILDING' | 'ERROR' | 'INITIALIZING' | 'QUEUED' | 'READY' | 'CANCELED';
  readyState?: 'READY' | 'ERROR' | 'BUILDING' | 'QUEUED' | 'INITIALIZING' | 'CANCELED';
  type: 'LAMBDAS';
  creator: {
    uid: string;
    email?: string;
    username?: string;
  };
  meta?: IDataObject;
  target?: 'production' | 'preview';
  aliasAssigned?: number | null;
  aliasError?: { code: string; message: string } | null;
  inspectorUrl?: string;
  buildingAt?: number;
  ready?: number;
  projectId?: string;
}

export interface IVercelDomain {
  name: string;
  apexName: string;
  projectId: string;
  redirect?: string;
  redirectStatusCode?: number;
  gitBranch?: string;
  updatedAt?: number;
  createdAt?: number;
  verified: boolean;
  verification?: IVercelDomainVerification[];
}

export interface IVercelDomainVerification {
  type: string;
  domain: string;
  value: string;
  reason: string;
}

export interface IVercelDomainConfig {
  configuredBy?: 'CNAME' | 'A' | 'http';
  acceptedChallenges?: ('dns-01' | 'http-01')[];
  misconfigured: boolean;
}

export interface IVercelEnvironmentVariable {
  id: string;
  key: string;
  value: string;
  type: 'plain' | 'encrypted' | 'secret' | 'sensitive';
  target: ('production' | 'preview' | 'development')[];
  gitBranch?: string;
  configurationId?: string;
  createdAt?: number;
  updatedAt?: number;
  createdBy?: string;
  updatedBy?: string;
  comment?: string;
}

export interface IVercelTeam {
  id: string;
  slug: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  avatar?: string;
  billing?: IDataObject;
  membership?: {
    role: 'OWNER' | 'MEMBER' | 'DEVELOPER' | 'BILLING';
    confirmed: boolean;
    createdAt: number;
  };
}

export interface IVercelTeamMember {
  uid: string;
  email: string;
  username: string;
  name?: string;
  role: 'OWNER' | 'MEMBER' | 'DEVELOPER' | 'BILLING';
  createdAt: number;
  teamId: string;
  avatar?: string;
}

export interface IVercelSecret {
  uid: string;
  name: string;
  created: number;
  createdAt: number;
  projectId?: string;
  userId?: string;
  teamId?: string;
}

export interface IVercelCheck {
  id: string;
  name: string;
  status: 'registered' | 'running' | 'completed';
  conclusion?: 'succeeded' | 'failed' | 'skipped' | 'canceled';
  blocking: boolean;
  integrationId: string;
  deploymentId: string;
  createdAt: number;
  updatedAt: number;
  startedAt?: number;
  completedAt?: number;
  detailsUrl?: string;
  output?: {
    metrics?: IDataObject;
  };
  rerequestable?: boolean;
}

export interface IVercelCertificate {
  id: string;
  cns: string[];
  created: number;
  createdAt: number;
  expiresAt: number;
  autoRenew: boolean;
}

export interface IVercelWebhook {
  id: string;
  url: string;
  events: string[];
  projectIds?: string[];
  createdAt: number;
  updatedAt: number;
  ownerId: string;
}

export interface IVercelLogDrain {
  id: string;
  name: string;
  type: 'json' | 'ndjson' | 'syslog';
  url: string;
  sources: ('static' | 'lambda' | 'edge' | 'external')[];
  createdAt: number;
  projectId?: string;
  configurationId?: string;
  deliveryFormat?: string;
  secret?: string;
  clientInfo?: IDataObject;
  environment?: string;
}

export interface IVercelEdgeConfig {
  id: string;
  slug: string;
  createdAt: number;
  updatedAt: number;
  digest: string;
  sizeInBytes: number;
  itemCount: number;
  ownerId: string;
}

export interface IVercelEdgeConfigItem {
  key: string;
  value: unknown;
  createdAt: number;
  updatedAt: number;
  edgeConfigId: string;
}

export interface IVercelEdgeConfigToken {
  id: string;
  token: string;
  label: string;
  createdAt: number;
  edgeConfigId: string;
}

export interface IVercelArtifact {
  hash: string;
  size: number;
  taskDurationMs?: number;
  tag?: string;
}

export type VercelResourceType =
  | 'project'
  | 'deployment'
  | 'domain'
  | 'environmentVariable'
  | 'team'
  | 'secret'
  | 'check'
  | 'certificate'
  | 'webhook'
  | 'logDrain'
  | 'edgeConfig'
  | 'artifact';

export type VercelProjectOperation =
  | 'create'
  | 'get'
  | 'getAll'
  | 'update'
  | 'delete'
  | 'addDomain'
  | 'removeDomain'
  | 'getProductionDeployment'
  | 'linkGitRepository'
  | 'unlinkGitRepository'
  | 'pauseProject'
  | 'unpauseProject';

export type VercelDeploymentOperation =
  | 'create'
  | 'get'
  | 'getAll'
  | 'delete'
  | 'getEvents'
  | 'getFiles'
  | 'getFileContents'
  | 'redeploy'
  | 'promote'
  | 'rollback';

export type VercelDomainOperation =
  | 'create'
  | 'get'
  | 'getAll'
  | 'delete'
  | 'verify'
  | 'getConfig'
  | 'checkAvailability'
  | 'purchase'
  | 'transferIn'
  | 'getDnsRecords'
  | 'createDnsRecord'
  | 'deleteDnsRecord';

export type VercelEnvironmentVariableOperation =
  | 'create'
  | 'get'
  | 'getAll'
  | 'update'
  | 'delete'
  | 'bulkCreate'
  | 'bulkDelete';

export type VercelTeamOperation =
  | 'get'
  | 'getAll'
  | 'update'
  | 'delete'
  | 'getMembers'
  | 'inviteMember'
  | 'removeMember'
  | 'updateMemberRole'
  | 'getInvites'
  | 'deleteInvite';

export type VercelSecretOperation = 'create' | 'get' | 'getAll' | 'delete' | 'rename';

export type VercelCheckOperation = 'create' | 'get' | 'getAll' | 'update' | 'rerequestCheck';

export type VercelCertificateOperation = 'get' | 'getAll' | 'issue' | 'delete' | 'upload';

export type VercelWebhookOperation = 'create' | 'get' | 'getAll' | 'update' | 'delete';

export type VercelLogDrainOperation = 'create' | 'get' | 'getAll' | 'delete';

export type VercelEdgeConfigOperation =
  | 'create'
  | 'get'
  | 'getAll'
  | 'update'
  | 'delete'
  | 'getItems'
  | 'getItem'
  | 'updateItems'
  | 'deleteItem'
  | 'createToken';

export type VercelArtifactOperation = 'exists' | 'get' | 'upload' | 'query';
