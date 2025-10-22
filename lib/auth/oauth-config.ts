/**
 * OAuth Configuration
 * Manages OAuth providers for authentication
 */

export interface OAuthProvider {
  id: string;
  name: string;
  icon: string;
  enabled: boolean;
  scopes?: string[];
}

export const OAUTH_PROVIDERS: OAuthProvider[] = [
  {
    id: 'google',
    name: 'Google',
    icon: '🔵',
    enabled: !!process.env.GOOGLE_CLIENT_ID,
    scopes: ['email', 'profile'],
  },
  {
    id: 'github',
    name: 'GitHub',
    icon: '⚫',
    enabled: !!process.env.GITHUB_CLIENT_ID,
    scopes: ['user:email', 'read:user'],
  },
];

export function getEnabledProviders(): OAuthProvider[] {
  return OAUTH_PROVIDERS.filter(p => p.enabled);
}

export function isProviderEnabled(providerId: string): boolean {
  const provider = OAUTH_PROVIDERS.find(p => p.id === providerId);
  return provider?.enabled || false;
}


