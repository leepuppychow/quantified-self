import $ from 'jquery';
import _ from 'lodash';
import MealsService from './mealsService';

class MealsHandler {

  constructor() {
    this.service = new MealsService()
    this.$ = this.grabElements()
    _.bindAll(this,
      'handlePrepend',
      'remainingCalories',
    )
  }

  populate() {
    this.service.index()
      .then(meals => meals.forEach(this.handlePrepend))
  }

  listen() {

  }

  handlePrepend({ id, name, foods }) {
    var totalCalories = 0
    foods.forEach(food => {
      totalCalories += food.calories
      $(`.${name.toLowerCase()} tbody`).prepend(`
        <tr>
          <th>${food.name}</th>
          <th>${food.calories}</th>
        </tr>
        `)
    })
    this.totalCalories(name, totalCalories)
    this.remainingCalories(name, totalCalories)
  }

  totalCalories(name, totalCalories) {
    $(`#${name.toLowerCase()}-total-calories`).html(totalCalories)
  }

  remainingCalories(name, totalCalories) {
    var goalCaloriesPerMeal = {
      Breakfast: 400,
      Snack: 200,
      Lunch: 600,
      Dinner: 800,
    }
    var remainingCalories = goalCaloriesPerMeal[name] - totalCalories
    $(`#${name.toLowerCase()}-remaining-calories`).html(remainingCalories)
  }

  grabElements() {
    return {
      body: $(document.body),
      // form: $('form.add-food'),
      // data: $('table.foods tbody'),
      // errors: $('.errors'),
      // inputs: {
      //   name: $(`form input[name="name"]`),
      //   calories: $(`form input[name="calories"]`),
      //   filter: $(`form input[name="filter"]`),
      // },
    }
  }
}

export default MealsHandler
