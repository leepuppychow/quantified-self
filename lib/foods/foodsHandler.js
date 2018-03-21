import $ from 'jquery'
import _ from 'lodash'
import Handler from '../shared/handler'
import FoodsService from './foodsService'
import Food from './foodModel'

class FoodsHandler extends Handler {

  constructor() {
    super()
    this.service = new FoodsService()
    this.$ = this.grabElements()
    this.editing = null
    _.bindAll(this,
      'prependFood',
      'handleFilterKeyup',
      'handleSubmitAddFood',
      'handleClickDelete',
      'handleClick',
      'handleEditorKeydown',
      'storeFoods',
      'renderAllFoods',
    )
    this.sortOptions = {
      0: (a, b) => a.id - b.id,
      1: (a, b) => b.calories - a.calories,
      2: (a, b) => a.calories - b.calories,
    }
    this.foods = new Map()
  }

  populate() {
    this.service.index()
      .then(foods => this.storeFoods(foods))
      .then(this.renderAllFoods)
  }

  renderAllFoods(option=0) {
    var sorted = [...this.foods.values()].sort(this.sortOptions[option])
    sorted.forEach(this.prependFood)
  }

  storeFoods(foods) {
    foods.forEach((food) => {
      this.foods.set(food.id, new Food(food))
    })
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

  renderFood({ id, name, calories }) {
    return `
      <tr data-id="${id}">
        <td class="check-box"><input class="food-checkbox" data-food-id="${id}" type="checkbox"></td>
        <td class="data name" data-field="name">${name}</td>
        <td class="data" data-field="calories">${calories}</td>
        <td>
          <button class="delete">x</button>
        </td>
      </tr>
    `
  }

  prependFood(food) {
    this.$.data.prepend(this.renderFood(food))
  }

  handleSubmitAddFood(event) {
    event.preventDefault()
    const { errors, inputs } = this.$
    const food = {
      name: inputs.name.val(),
      calories: inputs.calories.val(),
    }
    let errorText = ''
    if (!food.name) errorText += '<p>Please enter a food name</p>'
    if (!food.calories) errorText += '<p>Please enter a calorie amount</p>'
    errors.html(errorText)
    if (!errorText.length) {
      this.service.create(food).then(this.prependFood)
      inputs.name.val('')
      inputs.calories.val('')
    }
  }

  handleClickDelete(event) {
    const $tr = $(event.currentTarget.closest('tr'))
    $tr.hide()
    this.service.destroy($tr.data('id'))
      .then($tr.remove)
      .catch(() => this.restoreData($tr))
  }

  handleClick({ target }) {
    const $target = $(target)
    if (this.editing &&! $target.hasClass('editor')) this.submitEdit()
    if ($target.hasClass('data')) this.startEdit($target)
  }

  handleEditorKeydown({ key }) {
    if (key === "Enter") this.submitEdit()
    if (key === "Escape") this.cancelEdit()
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

  restoreData($tr) {
    $tr.show()
    const name = $tr.find('td.name').text()
    alert(`${name} is part of this balanced breakfast!\nIt can't be deleted.`)
  }
}

export default FoodsHandler
