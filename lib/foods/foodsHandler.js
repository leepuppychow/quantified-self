import $ from 'jquery';
import _ from 'lodash';
import FoodsService from './foodsService';

class FoodsHandler {

  constructor() {
    this.service = new FoodsService()
    this.$ = this.grabElements()
    _.bindAll(this,
      'handleSubmit',
      'handleDelete',
      'handlePrepend',
      'handleStartEdit',
      'handleFilter',
    )
  }

  populate() {
    this.service.index()
      .then(this.sortByIdDescending)
      .then(foods => foods.forEach(this.handlePrepend))
  }

  listen() {
    this.$.form.submit(this.handleSubmit)
    this.$.data.on('click', '.delete', this.handleDelete)
    this.$.body.on('click', '.data', this.handleStartEdit)
    this.$.inputs.filter.keyup(this.handleFilter)
    $('form.filter').submit(e => e.preventDefault())
  }

  handleSubmit(event) {
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
      this.service.create(food).then(this.handlePrepend)
      inputs.name.val('')
      inputs.calories.val('')
    }
  }

  handleDelete(event) {
    const $tr = $(event.currentTarget).closest('tr')
    $tr.hide()
    this.service.destroy($tr.data('id'))
      .then(() => $tr.remove())
      .catch(() => $tr.show())
  }

  handleStartEdit(event) {
    const $td = $(event.target)
    const field = $td.data('field')
    const $input = this.$.inputs[field].clone()
    $input.val($td.text())
    $td.replaceWith($input)
    $input.focus()
    this.waitToStopEditing({ $td, $input, field })
  }

  handleFilter(event) {
    const term = this.$.inputs.filter.val()
    $('td.name').each((_, td) => {
      $(td).closest('tr').toggle(td.innerHTML.startsWith(term))
    })
  }

  waitToStopEditing({ $td, $input, field }) {
    this.$.body.one('click', event => {
      if ($(event.target) === $input) return waitToStopEditing({ $td, $input, field })
      const newValue = $input.val()
      const oldValue = $td.text()
      $td.text(newValue)
      $input.replaceWith($td)
      if (newValue !== oldValue) {
        const id = $td.closest('tr').data('id')
        this.service.update(id, field, newValue)
          .catch(() => $td.text(oldValue))
      }
    })
  }

  handlePrepend({ id, name, calories }) {
    this.$.data.prepend(`
      <tr data-id="${id}">
        <td class="data name" data-field="name">${name}</td>
        <td class="data" data-field="calories">${calories}</td>
        <td>
          <button class="delete">Delete</button>
        </td>
      </tr>
    `)
  }

  sortByIdDescending(list){
    return list.sort((a, b) => a.id - b.id)
  }

  grabElements() {
    return {
      body: $(document.body),
      form: $('form.add-food'),
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
