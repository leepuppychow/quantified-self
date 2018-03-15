import $ from 'jquery';
import FoodsService from './foods/foodsService';

new FoodsService().getIndex().then(foods => {
  foods.forEach(food => {
    $('table.foods tbody').append(`
      <tr>
        <td>${food.name}</td>
        <td>${food.calories}</td>
        <td>DELETE</td>
      </tr>
    `)
  })
})
