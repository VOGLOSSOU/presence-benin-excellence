/**
 * Utilitaires pour gérer les tokens JWT
 */

/**
 * Décode un token JWT sans vérification (côté client)
 * ATTENTION: Ne pas utiliser pour la validation de sécurité côté serveur
 */
export function decodeJWT(token: string): any {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Erreur lors du décodage du token JWT:', error);
    return null;
  }
}

/**
 * Récupère les informations utilisateur depuis le token JWT
 */
export function getUserFromToken(token: string | null): any {
  if (!token) return null;

  const decoded = decodeJWT(token);
  if (!decoded) return null;

  return {
    id: decoded.id,
    username: decoded.username,
    role: decoded.role,
    tenantId: decoded.tenantId || null,
  };
}