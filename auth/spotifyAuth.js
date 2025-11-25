import * as AuthSession from "expo-auth-session";
import * as SecureStore from "expo-secure-store";
const clientId = "16d562df6c364e99b7352c5cf0183dfd";
const discovery = {
  authorizationEndpoint: "https://accounts.spotify.com/authorize",
  tokenEndpoint: "https://accounts.spotify.com/api/token",
};
export async function login() {
  const redirectUri = AuthSession.makeRedirectUri({
    scheme: "matchify",
  });
  // Create request (PKCE handled for you)
  const request = new AuthSession.AuthRequest({
    clientId,
    scopes: ["user-read-email", "user-read-private"],
    redirectUri,
    usePKCE: true,
    responseType: AuthSession.ResponseType.Code,
  });
  // Build auth URL automatically (only call needed now)
  const result = await request.promptAsync(discovery);
  if (result.type !== "success" || !result.params.code) {
    throw new Error("Spotify login canceled or failed.");
  }
  const code = result.params.code;
  // Exchange the authorization code for tokens
  const tokenResponse = await request.exchangeCodeAsync(
    {
      code,
      redirectUri,
      clientId,
    },
    discovery
  );
  await saveTokens(tokenResponse);
  return tokenResponse.accessToken;
}
async function saveTokens(tokens) {
  await SecureStore.setItemAsync("access_token", tokens.accessToken);
  await SecureStore.setItemAsync("refresh_token", tokens.refreshToken);
  await SecureStore.setItemAsync(
    "expiration",
    (Date.now() + tokens.expiresIn * 1000).toString()
  );
}