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
      'populateMeal',
      'fillTotalCaloriesTable',
      'handleFilterKeyup',
      'showTab',
      'addFoodToMeal',
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
    this.foodsHandler.populate()
  }

  listen() {
    this.$.inputs.filter.keyup(this.handleFilterKeyup)
    this.$.tabs.click(this.showTab)
    this.$.newFood.click(this.goToFoodsPage)
    this.$.addMeal.click(this.addFoodToMeal)
  }

  addFoodToMeal(event) {
    event.preventDefault()
    var mealID = $(event.target).data("meal-id")
    var checkedFoods = $('.food-checkbox:checked')
    $.each(checkedFoods, (_index, food) => {
      var foodID = $(food).data("food-id")
      this.service.addFood(mealID, foodID)
    })
  }

  goToFoodsPage() {
    location.href = "foods.html"
  }

  showTab(event) {
    event.preventDefault()
    this.$.tables.each((_index, table) => {
      $(`#${table.id}`).toggle(table.id === $(event.target).data("meal"))
    })
    // $(event.target).addClass("active-tab")
  }

  populateMeal({ name, foods, id: _id }) {
    foods.forEach(food => {
      this.totals[name] += food.calories
      $(`#${name.toLowerCase()} tbody`).prepend(`
        <tr>
          <td>${food.name}</td>
          <td>${food.calories}</td>
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
      inputs: {
        name: $(`form input[name="name"]`),
        calories: $(`form input[name="calories"]`),
        filter: $(`form input[name="filter"]`),
      },
      tabs: $('.tab'),
      tables: $('.meal-table'),
      newFood: $('#new-food-button'),
      addMeal: $('.add-meal-button'),
    }
  }
}

export default MealsHandler
