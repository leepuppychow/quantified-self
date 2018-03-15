import Service from '../service'

class FoodsService extends Service {

  getIndex() {
    return this.fetch('foods')
  }

  create(food) {
    return this.send('POST', 'foods', { food })
  }

  delete(id) {
    return this.send('DELETE', `foods/${id}`)
  }

}

export default FoodsService;
