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
      'handleClickTab',
      'handleClickAddMealFood',
      'changeSort',
    )
    this.meals = new Map()
    this.clickCount = 0
  }

  populate() {
    this.populateAllMeals().then(() => {
      debugger
    })
    this.foodsHandler.populate(true)
  }

  populateAllMeals() {
    return this.service.index()
      .then(rawMeals => rawMeals.forEach(rawMeal => {
        const meal = Meal.insert(rawMeal)
        this.$.tabs.append(meal.renderTab())
        this.$.tables.append(meal.renderTable())
        this.$.addMealFood.append(meal.renderAddToMealButton())
      }))
  }

  listen() {
    this.$.tabs.click(this.handleClickTab)
    this.$.addMealFood.click(this.handleClickAddMealFood)
    this.$.changeSort.click(this.changeSort)
  }

  changeSort() {
    this.foodsHandler.changeSort(++this.clickCount % 3)
  }

  handleClickAddMealFood(event) {
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

  handleClickTab(event) {
    event.preventDefault()
    const id = $(event.target).data('id')
    $('.tab').each((_index, tab) => {
      $(tab).toggleClass('active', tab === event.target)
    })
    $('.meal-table').each((_index, table) => {
      const $table = $(table)
      $table.toggle($table.data('id') === id)
    })
  }

  // displayCalorieTotals() {
  //   for(const field in ['goal', 'consumed', 'remaining']) {
  //     const total = this.meals.values.reduce((sum, meal) => sum + meal[field])
  //     this.$.totals.text(total)
  //   }
  // }

  grabElements() {
    return _.merge(super.grabElements(), {
      tabs: $('#tabs'),
      tables: $('#tables'),
      addMealFood: $('#add-meal-food'),
      changeSort: $('#change-sort'),
    })
  }
}

export default MealsHandler
