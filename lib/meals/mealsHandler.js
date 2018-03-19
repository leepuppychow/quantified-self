import $ from 'jquery'
import _ from 'lodash'
import MealsService from './mealsService'

class MealsHandler {

  constructor() {
    this.service = new MealsService()
    this.$ = this.grabElements()
    _.bindAll(this,
      'populateMeal',
      'fillTotalCaloriesTable',
    )
    this.totals = {
      Breakfast: 0,
      Lunch: 0,
      Dinner: 0,
      Snack: 0,
    }
    this.goalCaloriesPerMeal = {
      Breakfast: 400,
      Snack: 200,
      Lunch: 600,
      Dinner: 800,
    }
  }

  populate() {
    this.service.index()
      .then(meals => meals.forEach(this.populateMeal))
      .then(this.fillTotalCaloriesTable)
  }

  listen() {

  }

  populateMeal({ name, foods, id: _id }) {
    foods.forEach(food => {
      this.totals[name] += food.calories
      $(`.${name.toLowerCase()} tbody`).prepend(`
        <tr>
          <th>${food.name}</th>
          <th>${food.calories}</th>
        </tr>
      `)
    })
    this.showTotalCalories(name, this.totals[name])
    this.showRemainingCalories(name, this.totals[name])
  }

  showTotalCalories(meal, totalCalories) {
    $(`#${meal.toLowerCase()}-total-calories`).html(totalCalories)
  }

  showRemainingCalories(meal, totalCalories) {
    const remainingCalories = this.goalCaloriesPerMeal[meal] - totalCalories
    const mealRemainingCalories = $(`#${meal.toLowerCase()}-remaining-calories`)
    mealRemainingCalories.html(remainingCalories)
    this.addRemainingCaloriesStyle(remainingCalories, mealRemainingCalories)
  }

  fillTotalCaloriesTable() {
    const totalGoal = this.sumCalories(this.goalCaloriesPerMeal)
    const totalConsumed = this.sumCalories(this.totals)
    const totalRemaining = totalGoal - totalConsumed
    $("#total-calories-goal").html(totalGoal)
    $("#total-calories-consumed").html(totalConsumed)
    $("#total-calories-remaining").html(totalRemaining)
    this.addRemainingCaloriesStyle(totalRemaining, $("#total-calories-remaining"))
  }

  sumCalories(object) {
    return Object.values(object).reduce((sum, meal) => sum += meal)
  }

  addRemainingCaloriesStyle(calories, element) {
    element.addClass(
      calories >= 0
      ? 'positive-calories'
      : 'negative-calories'
    )
  }

  grabElements() {
    return {
      body: $(document.body),
    }
  }
}

export default MealsHandler
