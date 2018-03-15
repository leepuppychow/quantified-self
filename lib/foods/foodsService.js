class FoodsService {

  fetch(path){
    return fetch(`https://quantified-self-rails-api.herokuapp.com/api/v1/${path}`)
  }

  getIndex() {
    return this.fetch('foods')
      .then(response => response.json())
      .catch(console.log)
  }

}

export default FoodsService;
