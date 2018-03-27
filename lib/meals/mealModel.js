import _ from 'lodash'
import ViewModel from '../shared/ViewModel'

class Meal extends ViewModel {
  constructor({ id, name, foods }){
    super()
    this.id = id
    this.name = name
    this.foods = foods
    this.calculateCalories()
  }

  calculateCalories() {
    const goal = Meal.goals[this.name]
    // const consumed = _.sumBy(this.foods, 'calories')
    const consumed = this.foods.reduce((sum, food) => sum + food.calories, 0)
    const remaining = goal - consumed
    this.calories = { goal, consumed, remaining }
  }

  renderTab() {
    return `<button class="tab" data-id="${this.id}">${this.name}</button>`
  }

  renderTable() {
    return `
      <table class="meal-table" data-id="${this.id}">
        <thead>
          <tr>
            <th>Name</th>
            <th>Calories</th>
          </tr>
        </thead>
        <tbody>
          ${this.renderTableBody()}
        </tbody>
      </table>
    `
  }

  renderTableBody() {
    const { remaining, consumed } = this.calories
    return `
      <tbody>
        ${this.foods.map(this.renderMealFood).join('')}
        <tr>
          <td>Total Calories</td>
          <td class="total-calories">${consumed}</td>
        </tr>
        <tr>
          <td>Remaining Calories</td>
          <td class="${Meal.sign(remaining)}">${remaining}</td>
        </tr>
      </tbody>
    `
  }

  renderMealFood({ name, calories }) {
    return `
      <tr>
        <td>${name}</td>
        <td>${calories}</td>
      </tr>
    `
  }

  renderAddToMealButton() {
    return `<button data-id="${this.id}" class="add-meal-button">${this.name}</button>`
  }

}

Meal.initialize()

Meal.sign = function(calories) {
  return calories < 0 ? 'negative' : 'positive'
}

Meal.goals = {
  Breakfast: 400,
  Snack: 200,
  Lunch: 600,
  Dinner: 800,
}

Meal.calculateCalorieTotals = function(){
  const meals = this.all()
  const first = meals.shift()
  return meals.reduce((totals, meal) => (
    _.mergeWith(totals, meal.calories, (sum, addition) => sum + addition)
  ), first.calories)
}

export default Meal
