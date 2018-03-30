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
    const sorted = Food.all().sort(this.sortOptions[option])
    const newContents = sorted.map(food => food.render())
    this.$.foods.html(newContents)
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
    if ($target.data('field')) this.startEdit($target)

  }

  startEdit($p) {
    const field = $p.data('field')
    const $input = this.$.inputs[field].clone()
    $input.val($p.text())
    $input.addClass('editor')
    $p.replaceWith($input)
    $input.focus()
    this.editing = { $p, $input, field }
  }

  handleEditorKeydown({ key }) {
    if (key === "Enter") this.submitEdit()
    if (key === "Escape") this.cancelEdit()
  }

  cancelEdit() {
    const { $p, $input } = this.editing
    this.editing = null
    $input.replaceWith($p)
  }

  submitEdit() {
    const { $p, $input, field } = this.editing
    const newValue = $input.val()
    if (!newValue) {
      this.cancelEdit()
      window.alert('value can\'t be empty')
      return
    }
    this.editing = null
    const oldValue = $p.text()
    $p.text(newValue)
    $input.replaceWith($p)
    if (newValue !== oldValue) {
      const id = $p.closest('tr').data('id')
      this.service.update(id, field, newValue)
        .catch(() => $p.text(oldValue))
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
