class FoodsService {

  fetch(path, options){
    return fetch(`https://quantified-self-rails-api.herokuapp.com/api/v1/${path}`, options)
  }

  getIndex() {
    return this.fetch('foods')
      .then(response => response.json())
      .catch(console.log)
  }

  create(food) {
    const body = JSON.stringify({ food })
    const headers = { 'Accept': 'application/json', 'Content-Type': 'application/json'   }
    return this.fetch('foods', { body, headers, method: 'POST' })
  }

}

export default FoodsService;
