// import './main.scss'
// import $ from 'jquery'
//
// class Meals {
//   index() {
//     return fetch('https://quantified-self-rails-api.herokuapp.com/api/v1/meals')
//       .then(data => data.json())
//       .then(result => {
//         var mealsFoods = {
//           breakfast: result[0].foods,
//           snacks: result[1].foods,
//           lunch: result[2].foods,
//           dinner: result[3].foods,
//         }
//         this.populateMealTables(mealsFoods)
//       })
//       .catch(error => console.error( {error} ))
//   }
//
//   populateMealTables(meals){
//     for (var meal in meals){
//       var totalCalories = 0
//       meals[meal].forEach(food => {
//         totalCalories += food.calories
//         $(`.${meal} tbody`).prepend(`
//           <tr>
//             <th>${food.name}</th>
//             <th>${food.calories}</th>
//           </tr>
//           `)
//       })
//       $(`#${meal}-total-calories`).html(totalCalories)
//     }
//   }
// }
//
// var m = new Meals()
// m.index()
