import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0', // OpenAPI version
    info: {
      title: 'API Documentation', // API title
      version: '1.0.0', // API version
      description: 'Documentation for the API',
    },
    servers: [
      {
        url: 'http://localhost:4000', // The base URL of your API
        description: 'Local server',
      },
    ],
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
