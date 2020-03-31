import 'isomorphic-fetch';
import mockAsyncStorage from '@react-native-community/async-storage/jest/async-storage-mock';
import {v4} from 'uuid';


jest.mock('@react-native-community/async-storage', () => mockAsyncStorage);
jest.mock('@react-native-community/cookies', () => ({
                                               addEventListener: jest.fn(),
                                               removeEventListener: jest.fn(),
                                               openURL: jest.fn(),
                                               canOpenURL: jest.fn(),
                                               getInitialURL: jest.fn(),
                                               clearAll: jest.fn(),
                                               get: () => Promise.resolve(null),
                                             }));

jest.mock('uuid', () => {
  return {v4: jest.fn(() => 1234)};
});
