import $ from 'jquery'
import _ from 'lodash'
import Handler from '../shared/handler'
import MealsService from './mealsService'
import FoodsHandler from '../foods/foodsHandler'
import Meal from './mealModel'
import Food from '../foods/foodModel'

class MealsHandler extends Handler {

  constructor() {
    super()
    this.service = new MealsService()
    this.foodsHandler = new FoodsHandler()
    _.bindAll(this,
      'handleClickTab',
      'handleClickAddMealFood',
      'handleClickDeleteMealFood',
      'changeSort',
    )
    this.clickCount = 0
  }

  populate() {
    this.populateAllMeals().then(() => {
      this.displayCalorieTotals()
      $('.tab:first-child').click()
    })
    this.foodsHandler.populate(true)
  }

  populateAllMeals() {
    return this.service.index()
      .then(rawMeals => rawMeals.forEach(rawMeal => {
        const meal = Meal.insert(rawMeal)
        this.$.tabs.append(meal.renderTab())
        this.$.tables.prepend(meal.renderTable())
        this.$.addMealFood.append(meal.renderAddToMealButton())
      }))
  }

  displayCalorieTotals() {
    const totals = Meal.calculateCalorieTotals()
    for (const type in totals) {
      $(`#totals .${type}`).html(totals[type])
    }
    $(`#totals .remaining`).addClass(Meal.sign(totals.remaining))
  }

  listen() {
    super.listen()
    this.$.tabs.click(this.handleClickTab)
    this.$.addMealFood.on('click', 'button', this.handleClickAddMealFood)
    this.$.changeSort.click(this.changeSort)
    this.$.tables.on('click', '.delete', this.handleClickDeleteMealFood)
  }

  changeSort() {
    this.foodsHandler.changeSort(++this.clickCount % 3)
  }

  handleClickAddMealFood(event) {
    event.preventDefault()
    const mealId = $(event.target).data('id')
    const checkedFoods = $(':checked')
    const completed =  $.map(checkedFoods, food => {
      const foodId = $(food).closest('tr').data('id')
      return this.service.addFood(mealId, foodId)
        .then(Meal.find(mealId).foods.push(Food.find(foodId)))
    })
    Promise.all(completed)
      this.updateTable(mealId)
      this.displayCalorieTotals()
      this.changeTab(mealId)
      this.removeChecksFromBoxes(checkedFoods)
  }

  handleClickDeleteMealFood(event) {
    const $tr = $(event.currentTarget.closest('tr'))
    const foodId = $tr.data('id')
    const mealId = $tr.closest('table').data('id')
    $tr.hide()
    this.service.removeFood(mealId, foodId)
      .then(() => this.removeMealFood(mealId, foodId, $tr))
      .catch($tr.show())
  }

  removeMealFood(mealId, foodId, $tr) {
    $tr.remove()
    _.remove(Meal.find(mealId).foods, food => food.id == foodId)
    this.updateTable(mealId)
    this.displayCalorieTotals()
  }

  updateTable(mealId) {
    $(`table[data-id="${mealId}"]`).html(Meal.find(mealId).renderTable())
  }

  removeChecksFromBoxes(checkedFoods){
    checkedFoods.prop('checked', false)
  }

  handleClickTab(event) {
    this.changeTab($(event.target).data('id'))
  }

  changeTab(id) {
    $('.tab, .meal-table').each((_index, el) => {
      const $el = $(el)
      $el.toggleClass('active', $el.data('id') === id)
    })
  }

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
