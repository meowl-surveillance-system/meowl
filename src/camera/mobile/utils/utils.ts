import AsyncStorage from '@react-native-community/async-storage';
/**
 * Makes a request to log out from the server
 * @param serverUrl - Server URL that is hosting the requests
 * @param logoutEndpoint - Endpoint where the logout method is called
 * @returns the response to log out from the server
 */
export async function logout(
  serverUrl: string,
  logoutEndpoint = '/auth/logout',
) {
  const logoutUrl: string = serverUrl + logoutEndpoint;
  console.log(logoutUrl);
  try {
    const logoutResponse = await fetch(logoutUrl, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        credentials: 'include',
      },
    });
    return logoutResponse;
  } catch (err) {
    return null;
  }
}

/**
 * Makes a request to log into the server
 * @param credentials - Credentials required to login (e.g. username/password)
 * @param serverUrl - Server URL that is hosting the requests
 * @param loginEndpoint - Endpoint where the login method is called
 * @returns the response to log into the server
 */
export async function login(
  credentials: object,
  serverUrl: string,
  loginEndpoint = '/auth/login',
) {
  const loginUrl = serverUrl + loginEndpoint;
  try {
    const loginResponse = await fetch(loginUrl, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        credentials: 'include',
      },
      body: JSON.stringify(credentials),
    });
    return loginResponse;
  } catch (err) {
    return null;
  }
}

/**
 * Get item from AsyncStorage if found else return value from args
 * 
 * @param key - Key to retrieve value from AsyncStorage
 * @param value - value to be used if value not found in AsyncStorage
 * @returns value
 */
export async function getItemFromStore(
  key: string,
  value: string = ''
): Promise<string> {
  const valueFromStore: string | null = await AsyncStorage.getItem(key);
  if (valueFromStore) {
    return valueFromStore;
  }
  return value;
}