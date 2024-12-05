
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Quick Task API',
      version: '1.0.0',
      description: 'API para gerenciamento de boards, colunas e tarefas',
    },
    components: {
      schemas: {
        Email: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            email: { type: 'string' }
          }
        },
        Board: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            title: { type: 'string' },
            owner: { type: 'string' }
          }
        },
        Column: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            boardId: { type: 'string' },
            title: { type: 'string' }
          }
        },
        Task: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            columnId: { type: 'string' },
            title: { type: 'string' },
            description: { type: 'string' }
          }
        }
      }
    }
  },
  apis: ['./api/routes/*.js']
};

module.exports = swaggerJsdoc(options);