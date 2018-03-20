import $ from 'jquery';
import _ from 'lodash';
import Handler from '../shared/handler'
import FoodsService from './foodsService';

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
    )
  }

  populate() {
    this.service.index()
      .then(this.sortByIdDescending)
      .then(foods => foods.forEach(this.prependFood))
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

  prependFood({ id, name, calories }) {
    this.$.data.prepend(`
      <tr data-id="${id}">
        <td class="check-box"><input class="food-checkbox" data-food-id="${id}" type="checkbox"></td>
        <td class="data name" data-field="name">${name}</td>
        <td class="data" data-field="calories">${calories}</td>
        <td>
          <button class="delete">x</button>
        </td>
      </tr>
    `)
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
    $tr.remove()
    this.service.destroy($tr.data('id'))
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
    this.$.data.prepend($tr)
    const name = $tr.find('td.name').text()
    alert(`${name} is part of this balanced breakfast!\nIt can't be deleted.`)
  }

  sortByIdDescending(list){
    return list.sort((a, b) => a.id - b.id)
  }

  grabElements() {
    return {
      body: $(document.body),
      addFood: $('form.add-food'),
      data: $('table.foods tbody'),
      errors: $('.errors'),
      inputs: {
        name: $(`form input[name="name"]`),
        calories: $(`form input[name="calories"]`),
        filter: $(`form input[name="filter"]`),
      },
    }
  }
}

export default FoodsHandler
