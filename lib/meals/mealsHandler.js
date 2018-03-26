import $ from 'jquery'
import _ from 'lodash'
import Handler from '../shared/handler'
import MealsService from './mealsService'
import FoodsHandler from '../foods/foodsHandler'

class MealsHandler extends Handler {

  constructor() {
    super()
    this.service = new MealsService()
    this.foodsHandler = new FoodsHandler()
    this.$ = this.grabElements()
    _.bindAll(this,
      'fillTotalCaloriesTable',
      'handleFilterKeyup',
      'showTab',
<<<<<<< Updated upstream
      'addFoodToMeal',
<<<<<<< Updated upstream
      'sortFoodTable',
=======
=======
      'displayMealFood',
      'sortFoodTable',
>>>>>>> Stashed changes
>>>>>>> Stashed changes
    )
    this.totals = {
      Breakfast: 0,
      Lunch: 0,
      Dinner: 0,
      Snack: 0,
    }
    this.goals = {
      Breakfast: 400,
      Snack: 200,
      Lunch: 600,
      Dinner: 800,
    }
    this.mealList = {
      1: "breakfast",
      2: "snack",
      3: "lunch",
      4: "dinner",
    }
    this.clickCount = 0
  }

  populate() {
<<<<<<< Updated upstream
    this.populateFoodsInEachMeal()
    this.foodsHandler.populate()
  }

  populateFoodsInEachMeal() {
    return this.service.index()
=======
<<<<<<< Updated upstream
    this.service.index()
>>>>>>> Stashed changes
      .then(meals => meals.forEach(this.populateMeal))
=======
    this.populateFoodsInEachMeal()
    this.foodsHandler.populate()
  }

  populateFoodsInEachMeal() {
    return this.service.index()
      .then(meals => meals.forEach(({ name: meal, foods }) => {
        foods.forEach(food => this.displayMealFood(meal, food))
        this.updateCalorieSubtotal(meal)
      }))
>>>>>>> Stashed changes
      .then(this.fillTotalCaloriesTable)
  }

  listen() {
    this.$.inputs.filter.keyup(this.handleFilterKeyup)
    this.$.tabs.click(this.showTab)
    this.$.newFood.click(this.goToFoodsPage)
<<<<<<< Updated upstream
    this.$.addMeal.click(this.addFoodToMeal)
<<<<<<< Updated upstream
    this.$.sortByCalories.click(this.sortFoodTable)
=======
=======
    this.$.addFood.click(this.addMealFood)
    this.$.sortByCalories.click(this.sortFoodTable)
>>>>>>> Stashed changes
>>>>>>> Stashed changes
  }

  sortFoodTable() {
    this.foodsHandler.renderAllFoods(++this.clickCount % 3)
  }
<<<<<<< Updated upstream

=======
<<<<<<< Updated upstream
>>>>>>> Stashed changes
  addFoodToMeal(event) {
    event.preventDefault()
    var mealID = $(event.target).data("meal-id")
    var checkedFoods = $('.food-checkbox:checked')
    var completed =  $.map(checkedFoods, food => {
      var foodID = $(food).data("food-id")
      return this.service.addFood(mealID, foodID)
    })
<<<<<<< Updated upstream
    Promise.all(completed)
      .finally(() => this.populateFoodsInEachMeal())
=======
=======

  addMealFood(event) {
    event.preventDefault()
    const mealID = $(event.target).data("meal-id")
    const checkedFoods = $('.food-checkbox:checked')
    const completed =  $.map(checkedFoods, food => {
      const foodID = $(food).data("food-id")
      return this.service.addMealFood(mealID, foodID)
        .then(() => this.displayMealFood('breakfast', 'JavaScript'))
    })
    Promise.all(completed)
>>>>>>> Stashed changes
      .then(() => this.switchToAppropriateMealTab(mealID))
      .then(() => this.removeChecksFromBoxes(checkedFoods))
  }

  removeChecksFromBoxes(checkedFoods){
    checkedFoods.prop('checked', false)
  }

  switchToAppropriateMealTab(mealID) {
    var meal = this.mealList[mealID]
    $(`.tab[data-meal="${meal}"]`).click()
<<<<<<< Updated upstream
=======
>>>>>>> Stashed changes
>>>>>>> Stashed changes
  }

  goToFoodsPage() {
    location.href = "foods.html"
  }

  showTab(event) {
    event.preventDefault()
    $(".tab").css("background-color", "lightgrey")
    $(event.target).css("background-color", "darkgrey")
    this.$.tables.each((_index, table) => {
      $(`#${table.id}`).toggle(table.id === $(event.target).data("meal"))
    })
  }

  displayMealFood(meal, food) {
    this.totals[meal] += food.calories
    $(`#${meal.toLowerCase()} tbody`).prepend(`
      <tr>
        <td>${food.name}</td>
        <td>${food.calories}</td>
      </tr>
    `)
    this.updateCalorieSubtotal(meal)
    this.fillTotalCaloriesTable()
  }

  updateCalorieSubtotal(meal) {
    const total = this.totals[meal]
    const remaining = this.goals[meal] - total
    const $total = $(`#${meal.toLowerCase()}-total-calories`)
    const $remaining = $(`#${meal.toLowerCase()}-remaining-calories`).html(remaining)
    $total.html(total)
    $remaining.html(remaining)
    this.addRemainingCaloriesStyle(remaining, $remaining)
  }

  fillTotalCaloriesTable() {
    const totalGoal = this.sumCalories(this.goals)
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
    element.addClass(calories >= 0 ?
                    'positive-calories':
                    'negative-calories')
  }
}

export default MealsHandler
