const faker = require('faker')

class FactoryProduct {
  constructor(probability) {
    this.probability = probability / 100
    this.frontier = 3000000
  }

  createSeed() {
    const id = Math.random() * this.frontier
    return `${faker.commerce.product()} ${faker.commerce.productAdjective()} ${faker.commerce.color()} ${id}`
  }

  completeProduct(seed) {
    return `${faker.commerce.productMaterial()} ${seed} ${faker.commerce.department()}`
  }

  make() {
    const makeEquals = (Math.random() <= this.probability) ? true : false
    const seed = this.createSeed()
    let product1 = undefined
    let product2 = undefined
    if (makeEquals) {
      product1 = this.completeProduct(seed)
      product2 = this.completeProduct(seed)
    } else {
      product1 = this.completeProduct(this.createSeed())
      product2 = this.completeProduct(this.createSeed())
    }
    return {
      seed,
      product1,
      product2
    }
  }
}

module.exports = FactoryProduct