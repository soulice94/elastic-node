const test = require('ava')
const FactoryProduct = require('../src/factory_product')

const probability = 25

test('factory product', t => {
  const factory = new FactoryProduct(probability) 
  t.is(typeof factory.createSeed(), 'string')
  t.pass()
})

test('make', t => {
  const factory = new FactoryProduct(probability)
  const productObject = factory.make()
  t.is(typeof productObject, 'object')
  t.pass()
})