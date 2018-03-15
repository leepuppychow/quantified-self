import $ from 'jquery';
import _ from 'lodash';
import FoodsService from './foodsService';

class FoodsHandler {

  constructor() {
    this.service = new FoodsService()
    this.$tbody = $('table.foods tbody')
    _.bindAll(this, 'handleSubmit', 'handleDelete', 'addFood')
  }

  populate() {
    this.service.getIndex()
      .then(this.sortByIdDescending)
      .then(foods => foods.forEach(this.addFood))
  }

  listen() {
    $('form.add-food').on('submit', this.handleSubmit)
    this.$tbody.on('click', '.delete', this.handleDelete)
  }

  handleDelete(event) {
    const $td = $(event.currentTarget)
    const $tr = $($td).closest('tr')
    $tr.hide()
    this.service.delete($td.data('id'))
      .then(() => $tr.remove())
      .catch(() => $tr.show())
  }

  handleSubmit(event) {
    event.preventDefault()
    const food = {
      name: $(`input[name="name"]`).val(),
      calories: $(`input[name="calories"]`).val(),
    }
    const $errors = $('.errors')
    let errorText = ''
    if (!food.name) errorText += '<p>Please enter a food name</p>'
    if (!food.calories) errorText += '<p>Please enter a calorie amount</p>'
    $errors.html(errorText)
    if (!errorText.length) {
      this.service.create(food).then(this.addFood)
      $(`input[name="name"]`).val('')
      $(`input[name="calories"]`).val('')
    }
  }

  addFood({ id, name, calories }) {
    this.$tbody.prepend(`
      <tr>
        <td>${name}</td>
        <td>${calories}</td>
        <td>
          <button class="delete" data-id="${id}">Delete</button>
        </td>
      </tr>
    `)
  }

  sortByIdDescending(list){
    return list.sort((a, b) => a.id - b.id)
  }

}

export default FoodsHandler
