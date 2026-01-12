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

import {
	buildQueryParams,
	validateProjectIdentifier,
	validateTeamId,
	validateDeploymentId,
	simplifyResponse,
} from '../../nodes/Vercel/transport/api';

describe('Transport API Helpers', () => {
	describe('buildQueryParams', () => {
		it('should build empty object for empty input', () => {
			const result = buildQueryParams({});
			expect(result).toEqual({});
		});

		it('should include defined values', () => {
			const result = buildQueryParams({
				foo: 'bar',
				count: 10,
			});
			expect(result).toEqual({ foo: 'bar', count: 10 });
		});

		it('should exclude undefined values', () => {
			const result = buildQueryParams({
				foo: 'bar',
				empty: undefined,
			});
			expect(result).toEqual({ foo: 'bar' });
		});

		it('should exclude null values', () => {
			const result = buildQueryParams({
				foo: 'bar',
				empty: null,
			});
			expect(result).toEqual({ foo: 'bar' });
		});

		it('should exclude empty strings', () => {
			const result = buildQueryParams({
				foo: 'bar',
				empty: '',
			});
			expect(result).toEqual({ foo: 'bar' });
		});

		it('should include boolean false', () => {
			const result = buildQueryParams({
				active: false,
			});
			expect(result).toEqual({ active: false });
		});

		it('should include zero', () => {
			const result = buildQueryParams({
				count: 0,
			});
			expect(result).toEqual({ count: 0 });
		});
	});

	describe('validateProjectIdentifier', () => {
		it('should return true for valid project ID', () => {
			expect(validateProjectIdentifier('prj_123abc')).toBe(true);
		});

		it('should return true for valid project name', () => {
			expect(validateProjectIdentifier('my-project')).toBe(true);
		});

		it('should return true for alphanumeric project name', () => {
			expect(validateProjectIdentifier('myproject123')).toBe(true);
		});

		it('should return false for empty string', () => {
			expect(validateProjectIdentifier('')).toBe(false);
		});

		it('should return false for string with spaces', () => {
			expect(validateProjectIdentifier('my project')).toBe(false);
		});

		it('should return false for string with special characters', () => {
			expect(validateProjectIdentifier('my@project')).toBe(false);
		});
	});

	describe('validateTeamId', () => {
		it('should return true for valid team ID', () => {
			expect(validateTeamId('team_abc123')).toBe(true);
		});

		it('should return false for invalid team ID format', () => {
			expect(validateTeamId('invalid_team')).toBe(false);
		});

		it('should return false for empty string', () => {
			expect(validateTeamId('')).toBe(false);
		});

		it('should return false for team ID without prefix', () => {
			expect(validateTeamId('abc123')).toBe(false);
		});
	});

	describe('validateDeploymentId', () => {
		it('should return true for valid deployment ID with prefix', () => {
			expect(validateDeploymentId('dpl_abc123')).toBe(true);
		});

		it('should return true for alphanumeric deployment ID', () => {
			expect(validateDeploymentId('abc123xyz')).toBe(true);
		});

		it('should return true for simple alphanumeric string', () => {
			expect(validateDeploymentId('abc123')).toBe(true);
		});

		it('should return false for empty string', () => {
			expect(validateDeploymentId('')).toBe(false);
		});

		it('should return false for deployment ID with hyphens', () => {
			expect(validateDeploymentId('abc-123')).toBe(false);
		});

		it('should return false for deployment ID with special characters', () => {
			expect(validateDeploymentId('abc@123')).toBe(false);
		});
	});

	describe('simplifyResponse', () => {
		it('should return full data when no fields specified', () => {
			const data = { id: 1, name: 'test', extra: 'value' };
			expect(simplifyResponse(data)).toEqual(data);
		});

		it('should return full data when empty fields array specified', () => {
			const data = { id: 1, name: 'test', extra: 'value' };
			expect(simplifyResponse(data, [])).toEqual(data);
		});

		it('should return only specified fields', () => {
			const data = { id: 1, name: 'test', extra: 'value' };
			expect(simplifyResponse(data, ['id', 'name'])).toEqual({ id: 1, name: 'test' });
		});

		it('should skip fields not present in data', () => {
			const data = { id: 1, name: 'test' };
			expect(simplifyResponse(data, ['id', 'missing'])).toEqual({ id: 1 });
		});

		it('should handle undefined values correctly', () => {
			const data = { id: 1, name: undefined };
			expect(simplifyResponse(data, ['id', 'name'])).toEqual({ id: 1 });
		});
	});
});
