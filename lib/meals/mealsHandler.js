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
    _.bindAll(this,
      // 'populateMeal',
      'handleFilterKeyup',
      // 'showTab',
      // 'addFoodToMeal',
      // 'sortFoodTable',
    )
    this.meals = new Map()
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
    this.$.tabs.find(':first-child').addClass('active')
  }

  populateAllMeals() {
    this.service.index()
      .then(meals => meals.forEach(this.populateMeal))
      .then(this.displayCalorieTotals)
  }

  populateMeal(data) {
    const meal = new Meal(data)
    this.meals.set(meal.id, meal)
    this.$.tabs.append(meal.renderTab())
    this.$.tables.append(meal.renderTable())
    this.$.addToMeal.append(meal.renderAddToMealButton())
  }

  listen() {
    this.$.tabs.click(this.showTab)
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

  showTab(event) {
    event.preventDefault()
    this.$.tabs.each((_index, tab) => {
      $(tab).toggleClass('active', tab === event.target)
    })
    this.$.tables.each((_index, table) => {
      $(`#${table.id}`).toggle(table.id === $(event.target).data("meal"))
    })
  }

  displayCalorieTotals() {
    for(const field in ['goal', 'consumed', 'remaining']) {
      const total = this.meals.values.reduce((sum, meal) => sum + meal[field])
      this.$.totals.text(total)
    }
  }

  grabElements() {
    return _.merge(super.grabElements(), {
      tabs: $('#tabs'),
      tables: $('#meal-tables'),
      addToMeal: $('#addToMeal'),
      changeSort: $('#change-sort'),
    })
  }
}

export default MealsHandler
