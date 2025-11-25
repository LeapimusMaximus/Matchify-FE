import * as AuthSession from "expo-auth-session";
import * as SecureStore from "expo-secure-store";

const clientId = "16d562df6c364e99b7352c5cf0183dfd";
const discovery = {
  authorizationEndpoint: "https://accounts.spotify.com/authorize",
  tokenEndpoint: "https://accounts.spotify.com/api/token",
};

export async function getAccessToken() {
  return SecureStore.getItemAsync("access_token");
}

export async function getRefreshToken() {
  return SecureStore.getItemAsync("refresh_token");
}

async function getTokenExpiration() {
  const exp = await SecureStore.getItemAsync("expiration");
  return exp ? Number(exp) : 0;
}

async function saveTokens(tokens) {
  await SecureStore.setItemAsync("access_token", tokens.access_token);
  await SecureStore.setItemAsync("refresh_token", tokens.refresh_token);
  await SecureStore.setItemAsync(
    "expiration",
    (Date.now() + tokens.expires_in * 1000).toString()
  );
}

export async function isTokenExpired() {
  const exp = await getTokenExpiration();
  return !exp || Date.now() > exp;
}

export async function refreshAccessToken() {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) return null;

  const response = await fetch(discovery.tokenEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }).toString(),
  });

  console.log(response);

  const tokens = await response.json();
  if (tokens.error) {
    console.error("Refresh token error:", tokens);
    return null;
  }

  await saveTokens(tokens);
  return tokens.access_token;
}

export async function getValidAccessToken() {
  if (await isTokenExpired()) {
    return await refreshAccessToken();
  }
  return await getAccessToken();
}


export async function logout() {
  await SecureStore.deleteItemAsync("access_token");
  await SecureStore.deleteItemAsync("refresh_token");
  await SecureStore.deleteItemAsync("expiration");
}

export async function login() {
  const redirectUri = AuthSession.makeRedirectUri({
    scheme: "matchify", 
    useProxy: true,
  });

  const request = new AuthSession.AuthRequest({
    clientId,
    redirectUri,
    usePKCE: true,
    responseType: AuthSession.ResponseType.Code,
    scopes: ["user-read-email", "user-read-private"],
  });

  const result = await request.promptAsync(discovery);

  if (result.type !== "success" || !result.params.code) {
    throw new Error("Login cancelled or failed");
  }

  const code = result.params.code;

  const tokenResponse = await fetch(discovery.tokenEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", "Accept": "application/json", },
    body: new URLSearchParams({
      client_id: clientId,
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
      code_verifier: request.codeVerifier,
    }).toString(),
  });

  const text = await tokenResponse.text();
  let tokens;
  try {
    tokens = JSON.parse(text);
  } catch (err) {
    console.error("Token response is not JSON:", text);
    throw new Error("Failed to parse token response from Spotify");
  }

  if (tokens.error) {
    throw new Error(tokens.error_description || "Token exchange failed");
  }

  await saveTokens(tokens);

  return tokens.access_token;
}