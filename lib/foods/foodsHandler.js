import $ from 'jquery'
import _ from 'lodash'
import Handler from '../shared/handler'
import FoodsService from './foodsService'
import Food from './foodModel'

class FoodsHandler extends Handler {

  constructor() {
    super()
    this.service = new FoodsService()
    this.editing = null
    this.sortOptions = {
      0: (a, b) => a.id - b.id,
      1: (a, b) => b.calories - a.calories,
      2: (a, b) => a.calories - b.calories,
    }

    _.bindAll(this,
      'handleSubmitAddFood',
      'handleClickFoodDelete',
      'handleClick',
      'handleEditorKeydown',
      'addFood',
    )
  }

  populate(onMealPage) {
    Food.onMealPage = onMealPage
    this.service.index()
      .then(foods => foods.forEach(this.addFood))
  }

  addFood(data) {
    const food = Food.insert(data)
    this.$.foods.prepend(food.render())
  }

  changeSort(option) {
    const sorted = Food.all.sort(this.sortOptions[option])
    const newContents = sorted.map(food => food.render())
    this.$.data.html(newContents)
    debugger

    _.sort($('.food'))
  }

  listen() {
    super.listen()
    this.$.addFoodForm.submit(this.handleSubmitAddFood)
    this.$.foods.on('click', '.delete', this.handleClickFoodDelete)
    this.$.body.click(this.handleClick)
    this.$.body.on('keydown', '.editor', this.handleEditorKeydown)
  }

  handleSubmitAddFood(event) {
    event.preventDefault()
    let errorText = ''
    const name = this.$.inputs.name.val()
    const calories = this.$.inputs.calories.val()
    if (!name) errorText += '<p>Please enter a food name</p>'
    if (!calories) errorText += '<p>Please enter a calorie amount</p>'
    if (errorText) return this.$.errors.html(errorText)
    this.submitFood({ name, calories })
  }

  submitFood(food) {
    this.service.create(food).then(created => {
      this.addFood(created)
      this.$.inputs.name.val('')
      this.$.inputs.calories.val('')
    })
  }

  handleClickFoodDelete(event) {
    const $tr = $(event.currentTarget.closest('tr'))
    const id = $tr.data('id')
    $tr.hide()
    this.service.destroy(id)
      .then(() => this.removeFood(id, $tr))
      .catch(() => this.restoreFood($tr))
  }

  removeFood(id, $tr) {
    $tr.remove()
    Food.delete(id)
  }

  restoreFood($tr) {
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
    return _.merge(super.grabElements(), {
      addFoodForm: $('form.add-food'),
      inputs: {
        name: $(`form input[name="name"]`),
        calories: $(`form input[name="calories"]`),
      },
    })
  }

}

export default FoodsHandler
