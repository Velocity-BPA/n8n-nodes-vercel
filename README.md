# n8n-nodes-vercel

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

A comprehensive n8n community node for the Vercel API, enabling full programmatic management of deployments, projects, domains, environment variables, and team resources. This node empowers workflow automation for frontend deployment pipelines, CI/CD integration, and infrastructure-as-code patterns.

![n8n](https://img.shields.io/badge/n8n-community--node-blue)
![Version](https://img.shields.io/badge/version-1.0.0-green)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)

## Features

- **12 Resource Categories** with 70+ operations covering the complete Vercel API
- **Project Management** - Create, update, delete projects with Git repository linking
- **Deployment Operations** - Deploy, redeploy, promote, and rollback deployments
- **Domain Management** - Add domains, configure DNS records, manage certificates
- **Environment Variables** - Full CRUD with bulk operations and encryption support
- **Team Management** - Invite members, manage roles, handle team settings
- **Secrets Management** - Create and manage secrets across projects
- **Deployment Checks** - Create and update deployment checks
- **Certificates** - Issue, manage, and upload SSL certificates
- **Webhooks** - Configure event notifications with signature verification
- **Log Drains** - Set up log streaming to external services
- **Edge Config** - Manage edge configuration stores
- **Build Artifacts** - Cache and retrieve build artifacts
- **Webhook Trigger** - React to Vercel events in real-time

## Installation

### Community Nodes (Recommended)

1. Open n8n
2. Go to **Settings** > **Community Nodes**
3. Click **Install a community node**
4. Enter `n8n-nodes-vercel`
5. Click **Install**

### Manual Installation

```bash
# Navigate to your n8n installation directory
cd ~/.n8n

# Install the package
npm install n8n-nodes-vercel
```

### Development Installation

```bash
# Clone the repository
git clone https://github.com/Velocity-BPA/n8n-nodes-vercel.git
cd n8n-nodes-vercel

# Install dependencies
npm install

# Build the project
npm run build

# Link to n8n
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-vercel

# Restart n8n
```

## Credentials Setup

### Vercel API

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| Access Token | String | Yes | Personal Access Token from Vercel Dashboard |
| Team ID | String | No | Team ID for team-scoped operations (format: `team_xxxxxxxxxxxx`) |

**To create an Access Token:**

1. Navigate to [Vercel Dashboard](https://vercel.com/account/tokens)
2. Click **Create Token**
3. Provide a descriptive name
4. Select the scope (Full Account or specific Team)
5. Set an expiration date
6. Copy the token immediately (shown only once)

## Resources & Operations

### Project

| Operation | Description |
|-----------|-------------|
| Create | Create a new project |
| Get | Get project details |
| Get Many | List all projects |
| Update | Update project settings |
| Delete | Delete a project |
| Add Domain | Add a domain to project |
| Remove Domain | Remove domain from project |
| Get Production Deployment | Get current production deployment |
| Link Git Repository | Connect Git repository |
| Unlink Git Repository | Disconnect Git repository |
| Pause Project | Pause project |
| Unpause Project | Resume project |

### Deployment

| Operation | Description |
|-----------|-------------|
| Create | Create new deployment |
| Get | Get deployment details |
| Get Many | List deployments |
| Delete | Cancel/delete deployment |
| Get Events | Get build logs/events |
| Get Files | List deployment files |
| Get File Contents | Get file content |
| Redeploy | Redeploy existing deployment |
| Promote | Promote to production |
| Rollback | Rollback deployment |

### Domain

| Operation | Description |
|-----------|-------------|
| Create | Add domain to account |
| Get | Get domain details |
| Get Many | List all domains |
| Delete | Remove domain |
| Verify | Verify domain ownership |
| Get Config | Get DNS configuration |
| Check Availability | Check domain availability |
| Purchase | Purchase domain |
| Transfer In | Initiate domain transfer |
| Get DNS Records | List DNS records |
| Create DNS Record | Create DNS record |
| Delete DNS Record | Remove DNS record |

### Environment Variable

| Operation | Description |
|-----------|-------------|
| Create | Create environment variable |
| Get | Get variable details |
| Get Many | List all variables |
| Update | Update variable |
| Delete | Delete variable |
| Bulk Create | Create multiple variables |
| Bulk Delete | Delete multiple variables |

### Team

| Operation | Description |
|-----------|-------------|
| Get | Get team details |
| Get Many | List all teams |
| Update | Update team settings |
| Delete | Delete team |
| Get Members | List team members |
| Invite Member | Invite user to team |
| Remove Member | Remove member |
| Update Member Role | Change member role |
| Get Invites | List pending invitations |
| Delete Invite | Cancel invitation |

### Secret

| Operation | Description |
|-----------|-------------|
| Create | Create a secret |
| Get | Get secret metadata |
| Get Many | List all secrets |
| Delete | Delete a secret |
| Rename | Rename a secret |

### Check

| Operation | Description |
|-----------|-------------|
| Create | Create deployment check |
| Get | Get check details |
| Get Many | List checks |
| Update | Update check status |
| Rerequest | Re-request check run |

### Certificate

| Operation | Description |
|-----------|-------------|
| Get | Get certificate details |
| Get Many | List certificates |
| Issue | Issue new certificate |
| Delete | Delete certificate |
| Upload | Upload custom certificate |

### Webhook

| Operation | Description |
|-----------|-------------|
| Create | Create webhook |
| Get | Get webhook details |
| Get Many | List webhooks |
| Update | Update webhook |
| Delete | Delete webhook |

### Log Drain

| Operation | Description |
|-----------|-------------|
| Create | Create log drain |
| Get | Get log drain details |
| Get Many | List log drains |
| Delete | Delete log drain |

### Edge Config

| Operation | Description |
|-----------|-------------|
| Create | Create edge config |
| Get | Get edge config details |
| Get Many | List edge configs |
| Update | Update edge config |
| Delete | Delete edge config |
| Get Items | Get all items |
| Get Item | Get specific item |
| Update Items | Update multiple items |
| Delete Item | Delete item |
| Create Token | Create access token |

### Artifact

| Operation | Description |
|-----------|-------------|
| Exists | Check if artifact exists |
| Get | Download artifact |
| Upload | Upload artifact |
| Query | Query artifact status |

## Trigger Node

The **Vercel Trigger** node allows you to start workflows when Vercel events occur.

### Supported Events

- `deployment.created` - New deployment created
- `deployment.succeeded` - Deployment completed successfully
- `deployment.failed` - Deployment failed
- `deployment.canceled` - Deployment was canceled
- `deployment.error` - Deployment error occurred
- `deployment.check-rerequested` - Check was re-requested
- `project.created` - New project created
- `project.removed` - Project was deleted
- `domain.created` - Domain was added
- `integration-configuration.permission-upgraded` - Integration permissions changed
- `integration-configuration.removed` - Integration removed
- `integration-configuration.scope-change-confirmed` - Integration scope changed

### Webhook Verification

The trigger node automatically verifies webhook signatures using HMAC SHA-1 to ensure requests originate from Vercel.

## Usage Examples

### Deploy a Project

```javascript
// Trigger deployment when code is pushed
{
  "resource": "deployment",
  "operation": "create",
  "projectId": "my-nextjs-app",
  "additionalFields": {
    "target": "production",
    "gitSource": {
      "type": "github",
      "ref": "main",
      "repoId": "123456789"
    }
  }
}
```

### Set Environment Variables

```javascript
// Bulk create environment variables
{
  "resource": "environmentVariable",
  "operation": "bulkCreate",
  "projectId": "my-project",
  "envVars": {
    "envVar": [
      {
        "key": "API_KEY",
        "value": "secret-value",
        "target": ["production", "preview"],
        "type": "encrypted"
      },
      {
        "key": "DEBUG",
        "value": "false",
        "target": ["development"],
        "type": "plain"
      }
    ]
  }
}
```

### Add Custom Domain

```javascript
// Add domain to project
{
  "resource": "project",
  "operation": "addDomain",
  "projectId": "my-project",
  "domain": "app.example.com",
  "additionalFields": {
    "gitBranch": "main",
    "redirect": null
  }
}
```

## Vercel Concepts

### Projects vs Deployments

- **Project**: A container for your application, linked to a Git repository
- **Deployment**: A specific build/version of your project at a point in time

### Deployment Targets

- **Production**: The main live version accessible at your primary domain
- **Preview**: A deployment for testing, accessible at a unique preview URL

### Environment Variable Types

- **Plain**: Standard unencrypted variable
- **Encrypted**: Encrypted at rest, decrypted at build/runtime
- **Secret**: Reference to a secret stored in Vercel
- **Sensitive**: Hidden in logs and UI

### Regions

Vercel deploys to multiple global regions for optimal performance:

| Region | Code | Location |
|--------|------|----------|
| US East | `iad1` | Washington, D.C. |
| US West | `sfo1` | San Francisco |
| Europe | `dub1` | Dublin |
| Europe | `fra1` | Frankfurt |
| Asia Pacific | `sin1` | Singapore |
| Asia Pacific | `hnd1` | Tokyo |
| Australia | `syd1` | Sydney |

## Error Handling

The node includes comprehensive error handling with:

- **Automatic Retry**: Exponential backoff for rate limit errors (429)
- **Detailed Error Messages**: Clear descriptions from Vercel API errors
- **Validation**: Input validation for project IDs, team IDs, and deployment IDs

### Common Error Codes

| Code | Description |
|------|-------------|
| `bad_request` | Invalid request parameters |
| `unauthorized` | Missing or invalid authentication |
| `forbidden` | Insufficient permissions |
| `not_found` | Resource does not exist |
| `conflict` | Resource conflict (duplicate) |
| `too_many_requests` | Rate limit exceeded |

## Security Best Practices

1. **Use Environment Variables**: Store sensitive data in encrypted environment variables
2. **Limit Token Scope**: Create tokens with minimal required permissions
3. **Set Token Expiration**: Use short-lived tokens when possible
4. **Use Team Scoping**: Scope operations to specific teams when applicable
5. **Webhook Verification**: Always verify webhook signatures in production

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Lint
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
```

## Author

**Velocity BPA**
- Website: [velobpa.com](https://velobpa.com)
- GitHub: [Velocity-BPA](https://github.com/Velocity-BPA)

## Licensing

This n8n community node is licensed under the **Business Source License 1.1**.

### Free Use

Permitted for personal, educational, research, and internal business use.

### Commercial Use

Use of this node within any SaaS, PaaS, hosted platform, managed service, or paid automation offering requires a commercial license.

For licensing inquiries: **licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure all tests pass and linting is clean before submitting.

## Support

- **Documentation**: [Vercel API Docs](https://vercel.com/docs/rest-api)
- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-vercel/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Velocity-BPA/n8n-nodes-vercel/discussions)

## Acknowledgments

- [Vercel](https://vercel.com) for their excellent API and documentation
- [n8n](https://n8n.io) for the powerful workflow automation platform
- The open-source community for inspiration and contributions
