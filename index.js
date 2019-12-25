const client = require('./src/client')
const elastic = require('./src/elastic')
const FactoryProduct = require('./src/factory_product')

const COLLECTIONA = 'collectiona'
const COLLECTIONB = 'collectionb'
const SEEDS = 'seeds'
// client.search({
//   index: 'customer',
//   body: {}
// }).then(result => {
//     console.log(result.body.hits.hits);
// })

async function run() {
  const dataset = [{
    id: 1,
    text: 'If I fall, don\'t bring me back.',
    user: 'jon',
    date: new Date()
  }, {
    id: 2,
    text: 'Witer is coming',
    user: 'ned',
    date: new Date()
  }, {
    id: 3,
    text: 'A Lannister always pays his debts.',
    user: 'tyrion',
    date: new Date()
  }, {
    id: 4,
    text: 'I am the blood of the dragon.',
    user: 'daenerys',
    date: new Date()
  }, {
    id: 5, // change this value to a string to see the bulk response with errors
    text: 'A girl is Arya Stark of Winterfell. And I\'m going home.',
    user: 'arya',
    date: new Date()
  }]

  const body = dataset.flatMap(doc => [{ index : {_index: 'tweets' } }, doc])

  elastic.createIndex('tweets')

  const result = await elastic.insertBulk(body)
  console.log(result)
}

// run().catch(console.log)

async function createIndexes() {
  elastic.createIndex(COLLECTIONA)
  elastic.createIndex(COLLECTIONB)
  // elastic.createIndex(SEEDS)
}

async function main() {
  const factory = new FactoryProduct(25)
  const indexSize = 10000
  const batchSize = 1000
  const extra = ((indexSize % batchSize) > 0) ? 1 : 0 
  const pages = (Math.floor(indexSize / batchSize)) + extra
  const productsA = []
  const productsB = []
  const seeds = []
  for (let i = 1; i<=pages; i++) {
    for(let j = 0; j<batchSize; j++) {
      const productFactored = factory.make()
      productsA.push({
        name: productFactored.product1
      })
      productsB.push({
        name: productFactored.product2
      })
      seeds.push({
        name: productFactored.seed
      })
    }
    const bodyA = productsA.flatMap(doc => [{ index: {_index: COLLECTIONA}}, doc])
    const bodyB = productsB.flatMap(doc => [{ index: {_index: COLLECTIONB}}, doc])
    const bodySeeds = seeds.flatMap(doc => [{ index: {_index: SEEDS}}, doc])
    await elastic.insertBulk(bodyA)
    await elastic.insertBulk(bodyB)
    await elastic.insertBulk(bodySeeds)
  }
}

// createIndexes().catch(console.log)
main().catch(console.log)