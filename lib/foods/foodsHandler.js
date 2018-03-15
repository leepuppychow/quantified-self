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
    const td = $(event.currentTarget)
    this.service.delete(td.data('id'))
      .then(() => $(td).closest('tr').remove())
  }

  handleSubmit(event) {
    event.preventDefault()
    const name = $('input[name="name"]').val()
    const calories = $('input[name="calories"]').val()
    this.service.create({ name, calories })
      .then(this.addFood)
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
