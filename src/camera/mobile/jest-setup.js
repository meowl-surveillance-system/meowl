import mockAsyncStorage from '@react-native-community/async-storage/jest/async-storage-mock';

jest.mock('@react-native-community/async-storage', () => mockAsyncStorage);
jest.mock('@react-native-community/cookies', () => ({
                                               addEventListener: jest.fn(),
                                               removeEventListener: jest.fn(),
                                               openURL: jest.fn(),
                                               canOpenURL: jest.fn(),
                                               getInitialURL: jest.fn(),
                                               get: () => Promise.resolve(null),
                                             }));
