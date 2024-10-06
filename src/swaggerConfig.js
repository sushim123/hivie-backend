import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'Documentation for the API',
    },
    servers: [
      {
        url: process.env.BASE_URL || 'http://localhost:4000',
        description: 'Local server',
      },
    ],
    components: {
      securitySchemes: {
        OAuth2: {
          type: 'oauth2',
          flows: {
            authorizationCode: {
              authorizationUrl: `${process.env.BASE_URL}/api/login`,
              tokenUrl: `${process.env.BASE_URL}/oauth/token`,
              scopes: {
                read: 'Grants read access',
                write: 'Grants write access',
              },

            },
          },
        },
      },
    },
    security: [
      {
        OAuth2: ['read', 'write'],
      },
    ],
  },
  apis: ['./src/routes/*.js'],  // Adjust to match your routes location
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
