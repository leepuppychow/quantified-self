import $ from 'jquery'
import _ from 'lodash'
import Handler from '../shared/handler'
import FoodsService from './foodsService'
import Food from './foodModel'

class FoodsHandler extends Handler {

  constructor() {
    super()
    this.service = new FoodsService()
    this.foods = new Map()
    this.editing = null
    this.sortOptions = {
      0: (a, b) => a.id - b.id,
      1: (a, b) => b.calories - a.calories,
      2: (a, b) => a.calories - b.calories,
    }

    _.bindAll(this,
      'handleSubmitAddFood',
      'handleClickDelete',
      'handleClick',
      'handleEditorKeydown',
      'addFood',
      'reorderFoods',
    )
  }

  populate() {
    this.service.index()
      .then(foods => foods.forEach(this.addFood))
  }

  reorderFoods(option) {
    const sorted = [...this.foods.values()].sort(this.sortOptions[option])
    const newContents = sorted.map(food => food.render())
    this.$.data.html(newContents)
    debugger

    _.sort($('.food'))
  }

  addFood(food) {
    const wrapped = new Food(food)
    this.foods.set(food.id, wrapped)
    this.$.data.prepend(wrapped.render())
  }

  listen() {
    const { addFood, data, body, inputs } = this.$
    inputs.filter.keyup(this.handleFilterKeyup)
    addFood.submit(this.handleSubmitAddFood)
    data.on('click', '.delete', this.handleClickDelete)
    body.click(this.handleClick)
    body.on('keydown', '.editor', this.handleEditorKeydown)
    $('form.filter').submit(e => e.preventDefault())
  }

  handleSubmitAddFood(event) {
    event.preventDefault()
    this.submitFood({
      name: this.$.inputs.name.val(),
      calories: this.$.inputs.calories.val(),
    })
  }

  submitFood({ name, calories }) {
    let errorText = ''
    if (!name) errorText += '<p>Please enter a food name</p>'
    if (!calories) errorText += '<p>Please enter a calorie amount</p>'
    if (errorText) return this.$.errors.html(errorText)
    this.service.create({ name, calories }).then(food => {
      this.addFood(food)
      this.$.inputs.name.val('')
      this.$.inputs.calories.val('')
    })
  }

  handleClickDelete(event) {
    const $tr = $(event.currentTarget.closest('tr'))
    const foodID = $tr.data('id')
    $tr.hide()
    this.service.destroy(foodID)
      .then(() => this.removeFood(foodID, $tr))
      .catch(() => this.restoreData($tr))
  }

  removeFood(foodID, $tr) {
    this.foods.delete(foodID)
    $tr.remove()
  }

  restoreData($tr) {
    $tr.show()
    const name = $tr.find('td.name').text()
    alert(`${name} is part of this balanced breakfast!\nIt can't be deleted.`)
  }

  handleClick({ target }) {
    const $target = $(target)
    if (this.editing &&! $target.hasClass('editor')) this.submitEdit()
    if ($target.hasClass('data')) this.startEdit($target)
  }

  startEdit($td) {
    const field = $td.data('field')
    const $input = this.$.inputs[field].clone()
    $input.val($td.text())
    $input.addClass('editor')
    $td.replaceWith($input)
    $input.focus()
    this.editing = { $td, $input, field }
  }

  handleEditorKeydown({ key }) {
    if (key === "Enter") this.submitEdit()
    if (key === "Escape") this.cancelEdit()
  }

  cancelEdit() {
    const { $td, $input } = this.editing
    this.editing = null
    $input.replaceWith($td)
  }

  submitEdit() {
    const { $td, $input, field } = this.editing
    this.editing = null
    const newValue = $input.val()
    const oldValue = $td.text()
    $td.text(newValue)
    $input.replaceWith($td)
    if (newValue !== oldValue) {
      const id = $td.closest('tr').data('id')
      this.service.update(id, field, newValue)
        .catch(() => $td.text(oldValue))
    }
  }

  grabElements() {
    _.merge(super.grabElements(), {
      addFoodForm: $('form.add-food'),
    })
  }

}

export default FoodsHandler
