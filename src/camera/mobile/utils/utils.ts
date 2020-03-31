export async function logout(
    serverUrl: string, logoutEndpoint: string = '/auth/logout') {
  const logoutUrl: string = serverUrl + logoutEndpoint;
  console.log(logoutUrl);
  try {
    const logoutResponse = await fetch(logoutUrl, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        credentials: 'include',
      }
    });
    return logoutResponse;
  } catch (err) {
    return null;
  }
}

export async function login(
    credentials: object, serverUrl: string,
    loginEndpoint: string = '/auth/login') {
  const loginUrl = serverUrl + loginEndpoint;
  try {
    const loginResponse = await fetch(loginUrl, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        credentials: 'include',
      },
      body: JSON.stringify(credentials)
    });
    return loginResponse;
  } catch (err) {
    return null;
  }
}
