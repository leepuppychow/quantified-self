import Service from '../shared/service'

class FoodsService extends Service {

  index() {
    return this.fetch('foods')
  }

  show(id) {
    return this.fetch(`foods/${id}`)
  }

  create(food) {
    return this.send('POST', 'foods', { food })
  }

  update(id, field, value) {
    return this.send('PATCH', `foods/${id}`, { [field]: value })
  }

  destroy(id) {
    return this.send('DELETE', `foods/${id}`)
  }

}

export default FoodsService
