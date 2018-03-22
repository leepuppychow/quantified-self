import $ from 'jquery'
import _ from 'lodash'
import Handler from '../shared/handler'
import MealsService from './mealsService'
import FoodsHandler from '../foods/foodsHandler'
import Meal from './mealModel'

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
      'sortFoodTable',
    )
    this.meals = new Map()
    this.mealList = {
      1: "breakfast",
      2: "snack",
      3: "lunch",
      4: "dinner",
    }
    this.clickCount = 0
    this.calorieTotals = {
      goal: 0,
      consumed: 0,
      remaining: 0,
    }
  }

  populate() {
    this.populateAllMeals()
    this.foodsHandler.populate()
  }

  populateAllMeals() {
    return this.service.index()
      .then(meals => meals.forEach(this.populateMeal))
      .then(this.fillTotalCaloriesTable)
  }

  populateMeal(meal) {
    this.meals.set(meal.id, new Meal(meal))
  }

  listen() {
    this.$.inputs.filter.keyup(this.handleFilterKeyup)
    this.$.tabs.click(this.showTab)
    this.$.newFood.click(this.goToFoodsPage)
    this.$.addMeal.click(this.addFoodToMeal)
    this.$.sortByCalories.click(this.sortFoodTable)
  }

  sortFoodTable() {
    this.foodsHandler.reorderFoods(++this.clickCount % 3)
  }

  addFoodToMeal(event) {
    event.preventDefault()
    var mealID = $(event.target).data("meal-id")
    var checkedFoods = $(':checked')
    var completed =  $.map(checkedFoods, food => {
      var foodID = $(food).data("food-id")
      return this.service.addFood(mealID, foodID)
    })
    Promise.all(completed)
      .finally(() => this.populateAllMeals())
      .then(() => this.switchToAppropriateMealTab(mealID))
      .then(() => this.removeChecksFromBoxes(checkedFoods))
  }

  removeChecksFromBoxes(checkedFoods){
    checkedFoods.prop('checked', false)
  }

  switchToAppropriateMealTab(mealID) {
    var meal = this.mealList[mealID]
    $(`.tab[data-meal="${meal}"]`).click()
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

  showTotalCalories(meal, totalCalories) {
    $(`#${meal.toLowerCase()}-total-calories`).html(totalCalories)
  }

  showRemainingCalories(meal, totalCalories) {
    const remainingCalories = Meal.targets[meal] - totalCalories
    const mealRemainingCalories = $(`#${meal.toLowerCase()}-remaining-calories`)
    mealRemainingCalories.html(remainingCalories)
    // this.addRemainingCaloriesStyle(remainingCalories, mealRemainingCalories)
  }

  fillTotalCaloriesTable() {
    const calorieTotals = this.sumCalories()
    for(field in this.totals) {
      $(`#total-calories-${field}`).html(this.calorieTotals[field])
    }
    // this.addRemainingCaloriesStyle(totalRemaining, $("#total-calories-remaining"))
  }

  sumCalories(object) {
    this.meals.forEach(meal => {
      for(field in this.totals) {
        this.totals[field] += meal.calories[field]
      }
    })
  }

  // addRemainingCaloriesStyle(calories, element) {
  //   element.addClass(calories >= 0 ?
  //                   'positive-calories':
  //                   'negative-calories')
  // }
}

export default MealsHandler
