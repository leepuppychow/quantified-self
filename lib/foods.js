import $ from 'jquery';
import './main.scss'
import FoodsService from './foods/foodsService';

const foodsService = new FoodsService()
const $tbody = $('table.foods tbody')
const $errors = $('.error')

const addFood = food => {
  $tbody.prepend(`
    <tr>
      <td>${food.name}</td>
      <td>${food.calories}</td>
      <td>
        <button type="button" class="delete" data-id="${food.id}">Delete</button>
      </td>
    </tr>
  `)
}



foodsService.getIndex().then(foods => foods.forEach(addFood))

$('form.add-food').on('submit', event => {
  event.preventDefault()

  const food = {
    name: $(`input[name="name"]`).val(),
    calories: $(`input[name="calories"]`).val(),
  }
  let errors = '';
  if (!food.name) errors += '<p>Please enter a food name</p>'
  if (!food.calories) errors += '<p>Please enter a calorie amount</p>'
  $errors.html(errors)
  if (!errors.length) {
    foodsService.create(food).then(addFood)
    $(`input[name="name"]`).val('')
    $(`input[name="calories"]`).val('')
  }
})

$tbody.on('click', '.delete', event => {
  const td = $(event.currentTarget)
  foodsService.delete(td.data('id'))
    .then(() => $(td).closest('tr').remove())
})
