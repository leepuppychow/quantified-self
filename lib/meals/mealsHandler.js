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
      .then( () => this.fillTotalCaloriesTable())
  }

  listen() {

  }

  populateMeal({ id, name, foods }) {
    let totalCalories = 0
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
    const mealRemainingCals = $(`#${meal.toLowerCase()}-remaining-calories`)
    mealRemainingCals.html(remainingCalories)
    this.addRemainingCalsStyle(remainingCalories, mealRemainingCals)
  }

  fillTotalCaloriesTable() {
    const totalGoal = this.getTotalGoalCalories()
    const totalConsumed = this.getTotalConsumed()
    const totalRemaining = totalGoal - totalConsumed
    $("#total-calories-goal").html(totalGoal)
    $("#total-calories-consumed").html(totalConsumed)
    $("#total-calories-remaining").html(totalRemaining)
    this.addRemainingCalsStyle(totalRemaining, $("#total-calories-remaining"))
  }

  getTotalGoalCalories() {
    return Object.values(this.goalCaloriesPerMeal).reduce((sum, meal) => sum += meal)
  }

  getTotalConsumed() {
    return Object.values(this.totals).reduce((sum, meal) => sum += meal)
  }

  addRemainingCalsStyle(calories, element) {
    calories <= 0 ? element.addClass('negative-calories') : element.addClass('positive-calories')
  }

  grabElements() {
    return {
      body: $(document.body),
    }
  }
}

export default MealsHandler
