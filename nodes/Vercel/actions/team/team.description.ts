/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { INodeProperties } from 'n8n-workflow';
import { VERCEL_TEAM_ROLES } from '../../constants/constants';

export const teamOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['team'],
      },
    },
    options: [
      {
        name: 'Delete',
        value: 'delete',
        description: 'Delete a team',
        action: 'Delete a team',
      },
      {
        name: 'Delete Invite',
        value: 'deleteInvite',
        description: 'Cancel a pending invitation',
        action: 'Delete invite',
      },
      {
        name: 'Get',
        value: 'get',
        description: 'Get team details',
        action: 'Get a team',
      },
      {
        name: 'Get Invites',
        value: 'getInvites',
        description: 'List pending invitations',
        action: 'Get invites',
      },
      {
        name: 'Get Many',
        value: 'getAll',
        description: 'Get many teams',
        action: 'Get many teams',
      },
      {
        name: 'Get Members',
        value: 'getMembers',
        description: 'List team members',
        action: 'Get team members',
      },
      {
        name: 'Invite Member',
        value: 'inviteMember',
        description: 'Invite user to team',
        action: 'Invite member',
      },
      {
        name: 'Remove Member',
        value: 'removeMember',
        description: 'Remove member from team',
        action: 'Remove member',
      },
      {
        name: 'Update',
        value: 'update',
        description: 'Update team settings',
        action: 'Update a team',
      },
      {
        name: 'Update Member Role',
        value: 'updateMemberRole',
        description: 'Update member role',
        action: 'Update member role',
      },
    ],
    default: 'getAll',
  },
];

export const teamFields: INodeProperties[] = [
  // Team ID
  {
    displayName: 'Team ID',
    name: 'teamId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['team'],
        operation: [
          'get',
          'update',
          'delete',
          'getMembers',
          'inviteMember',
          'removeMember',
          'updateMemberRole',
          'getInvites',
          'deleteInvite',
        ],
      },
    },
    default: '',
    placeholder: 'team_xxxxxxxxxxxx',
    description: 'The team identifier',
  },

  // User ID
  {
    displayName: 'User ID',
    name: 'userId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['team'],
        operation: ['removeMember', 'updateMemberRole'],
      },
    },
    default: '',
    description: 'The user identifier',
  },

  // Invite ID
  {
    displayName: 'Invite ID',
    name: 'inviteId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['team'],
        operation: ['deleteInvite'],
      },
    },
    default: '',
    description: 'The invitation identifier',
  },

  // Email (inviteMember)
  {
    displayName: 'Email',
    name: 'email',
    type: 'string',
    placeholder: 'name@email.com',
    required: true,
    displayOptions: {
      show: {
        resource: ['team'],
        operation: ['inviteMember'],
      },
    },
    default: '',
    description: 'Email address of the user to invite',
  },

  // Role (inviteMember, updateMemberRole)
  {
    displayName: 'Role',
    name: 'role',
    type: 'options',
    required: true,
    displayOptions: {
      show: {
        resource: ['team'],
        operation: ['inviteMember', 'updateMemberRole'],
      },
    },
    options: VERCEL_TEAM_ROLES,
    default: 'MEMBER',
    description: 'The role to assign to the member',
  },

  // Return All
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    displayOptions: {
      show: {
        resource: ['team'],
        operation: ['getAll', 'getMembers'],
      },
    },
    default: false,
    description: 'Whether to return all results or only up to a given limit',
  },

  // Limit
  {
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    displayOptions: {
      show: {
        resource: ['team'],
        operation: ['getAll', 'getMembers'],
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

  // Update Fields
  {
    displayName: 'Update Fields',
    name: 'updateFields',
    type: 'collection',
    placeholder: 'Add Field',
    displayOptions: {
      show: {
        resource: ['team'],
        operation: ['update'],
      },
    },
    default: {},
    options: [
      {
        displayName: 'Description',
        name: 'description',
        type: 'string',
        default: '',
        description: 'Team description',
      },
      {
        displayName: 'Name',
        name: 'name',
        type: 'string',
        default: '',
        description: 'Team display name',
      },
      {
        displayName: 'Slug',
        name: 'slug',
        type: 'string',
        default: '',
        description: 'Team URL slug',
      },
    ],
  },

  // Additional Fields (inviteMember)
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    displayOptions: {
      show: {
        resource: ['team'],
        operation: ['inviteMember'],
      },
    },
    default: {},
    options: [
      {
        displayName: 'Projects',
        name: 'projects',
        type: 'string',
        default: '',
        placeholder: 'project1, project2',
        description: 'Comma-separated list of accessible project IDs',
      },
    ],
  },
];
