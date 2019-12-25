const client = require('./client')
require('array.prototype.flatmap').shim()

async function createIndex(indexName) {
  await client.indices.create({
    index: indexName,
    body: {
      mappings: {
        properties: {
          name: { type: 'text' },
        }
      }
    }
  }, { ignore: [400] })
}

async function insertBulk(body) {
  const { body: bulkResponse } = await client.bulk({ refresh: true, body })
  if (bulkResponse.errors) {
    const erroredDocuments = []
    bulkResponse.items.forEach((action, i) => {
      const operation = Object.keys(action)[0]
      if (action[operation].error) {
        erroredDocuments.push({
          status: action[operation].status,
          error: action[operation].error,
          operation: body[i * 2],
          document: body[(i * 2) + 1]
        })
      }
    })
    return erroredDocuments
  }
}

module.exports = {
  insertBulk,
  createIndex,
}


