import $ from 'jquery';
import _ from 'lodash';
import MealsService from './mealsService';

class MealsHandler {

  constructor() {
    this.service = new MealsService()
    this.$ = this.grabElements()
    _.bindAll(this,
      'populateMeal',
    )
  }

  populate() {
    this.service.index()
      .then(meals => meals.forEach(this.populateMeal))
  }

  listen() {

  }

  populateMeal({ id, name, foods }) {
    let totalCalories = 0
    foods.forEach(food => {
      totalCalories += food.calories
      $(`.${name.toLowerCase()} tbody`).prepend(`
        <tr>
          <th>${food.name}</th>
          <th>${food.calories}</th>
        </tr>
        `)
    })
    this.showTotalCalories(name, totalCalories)
    this.showRemainingCalories(name, totalCalories)
  }

  showTotalCalories(meal, totalCalories) {
    $(`#${meal.toLowerCase()}-total-calories`).html(totalCalories)
  }

  showRemainingCalories(meal, totalCalories) {
    const goalCaloriesPerMeal = {
      Breakfast: 400,
      Snack: 200,
      Lunch: 600,
      Dinner: 800,
    }
    const remainingCalories = goalCaloriesPerMeal[meal] - totalCalories
    $(`#${meal.toLowerCase()}-remaining-calories`).html(remainingCalories)
  }

  grabElements() {
    return {
      body: $(document.body),
    }
  }
}

export default MealsHandler
