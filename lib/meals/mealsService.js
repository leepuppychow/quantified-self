import Service from '../service'

class MealsService extends Service {

  index() {
    return this.fetch('meals')
  }

  foods(id) {
    return this.fetch(`meals/${id}/foods`)
  }

  addFood(id, foodId) {
    return this.send('POST', `meals/${id}/foods/${foodId}`)
  }

  removeFood(id, foodId) {
    return this.send('DELETE', `meals/${id}/foods/${foodId}`)
  }

}

export default MealsService;
