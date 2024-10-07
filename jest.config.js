// jest.config.js
export default {
    testEnvironment: 'node',
    transform: {
      '^.+\\.js$': 'babel-jest', // Transform JS files using Babel
    },
    moduleFileExtensions: ['js', 'json', 'node'],
  };
