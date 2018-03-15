class FoodsService {

  fetch(path, options){
    return fetch(`https://quantified-self-rails-api.herokuapp.com/api/v1/${path}`, options)
      .then(this.checkOK)
      .then(this.parseIfJson)
  }

  getIndex() {
    return this.fetch('foods')
      .then(foods => this.sortByIdDescending(foods))
  }

  create(food) {
    const body = JSON.stringify({ food })
    const headers = { 'Accept': 'application/json', 'Content-Type': 'application/json'   }
    return this.fetch('foods', { body, headers, method: 'POST' })
  }

  delete(id) {
    return this.fetch(`foods/${id}`, {method: 'DELETE'})
  }

  sortByIdDescending(list){
    return list.sort((a, b) => a.id - b.id)
  }

  checkOK(res) {
    if (res.ok) return res;
    throw(new Error(`${res.status}: ${res.statusText}`))
  }

  parseIfJson(res) {
    return res.text().then(text => text && JSON.parse(text))
  }

}

export default FoodsService;
