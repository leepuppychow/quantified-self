class FoodsService {

  fetch(path, options){
    return fetch(`https://quantified-self-rails-api.herokuapp.com/api/v1/${path}`, options)
  }

  getIndex() {
    return this.fetch('foods')
      .then(response => response.json())
      .then(foods => this.sortFoodsByIdDescending(foods))
      .catch(console.log)
  }

  create(food) {
    const body = JSON.stringify({ food })
    const headers = { 'Accept': 'application/json', 'Content-Type': 'application/json'   }
    return this.fetch('foods', { body, headers, method: 'POST' })
  }

  delete(id) {
    return this.fetch(`foods/${id}`, {method: 'DELETE'})
      .catch(console.log)
  }

  sortFoodsByIdDescending(foods){
    return foods.sort((foodA,foodB) => foodB.id - foodA.id)
  }

}

export default FoodsService;
