module.exports = {
  preset: '@react-native/jest-preset',

  moduleNameMapper: {
    '^@react-native-async-storage/async-storage$':
      '<rootDir>/__mocks__/asyncStorageMock.js',
  },

  transformIgnorePatterns: [
    'node_modules/(?!(@react-native|react-native|@react-navigation|react-native-paper|react-native-vector-icons)/)',
  ],
};