import $ from 'jquery';
import FoodsService from './foods/foodsService';

const foodsService = new FoodsService()
const $tbody = $('table.foods tbody')

const addFood = food => {
  $tbody.prepend(`
    <tr>
      <td>${food.name}</td>
      <td>${food.calories}</td>
      <td>
        <button class="delete" data-id="${food.id}">Delete</button>
      </td>
    </tr>
  `)
}

foodsService.getIndex().then(foods => foods.forEach(addFood))

$('form.add-food').on('submit', event => {
  event.preventDefault()

  const name = $('input[name="name"]').val()
  const calories = $('input[name="calories"]').val()
  foodsService.create({ name, calories })
    .then(addFood)
})

$tbody.on('click', '.delete', event => {
  const td = $(event.currentTarget)
  foodsService.delete(td.data('id'))
    .then(() => $(td).closest('tr').remove())
})
