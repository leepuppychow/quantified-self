import $ from 'jquery';
import FoodsService from './foods/foodsService';

const foodsService = new FoodsService()

const addFood = food => {
  $('table.foods tbody').prepend(`
    <tr>
      <td>${food.name}</td>
      <td>${food.calories}</td>
      <td id="${food.id}">DELETE</td>
    </tr>
  `)
}

foodsService.getIndex().then(foods => foods.forEach(addFood))

$('form.add-food').on('submit', event => {
  event.preventDefault()
  const name = $('input[name="name"]').val()
  const calories = $('input[name="calories"]').val()
  foodsService.create({ name, calories })
    .then(food => food.json())
    .then(addFood)
    .catch(console.log)
})

$('.food-table-body').on('click', event => {
  var id = $(event.target).attr("id")
  foodsService.delete(id)
    .then( () => window.location.reload())
})
