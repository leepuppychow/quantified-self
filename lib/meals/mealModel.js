import ViewModel from '../shared/ViewModel'

class Meal extends ViewModel {
  constructor({ id, name, foods }){
    super()
    this.id = id
    this.name = name
    this.foods = foods
  }

  calculateCalories() {
    const goal = Meal.goals[this.name]
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
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          ${this.renderTableBody()}
        </tbody>
      </table>
    `
  }

  renderTableBody() {
    this.calculateCalories()
    const { remaining, consumed } = this.calories
    return `
      <tbody>
        ${this.foods.map(this.renderMealFood).join('')}
        <tr>
          <td>Total Calories</td>
          <td class="total-calories">${consumed}</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td>Remaining Calories</td>
          <td class="${Meal.sign(remaining)}">${remaining}</td>
          <td>&nbsp;</td>
        </tr>
      </tbody>
    `
  }

  renderMealFood({ name, calories, id }) {
    return `
      <tr data-id="${id}">
        <td>${name}</td>
        <td>${calories}</td>
        <td><button class="delete" aria-label="remove food from meal">
          <i class="material-icons">delete_forever</i>
        </button></td>
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
  return this.all().reduce((totals, meal) => {
    for (const type in meal.calories) {
      totals[type] = (totals[type] || 0) + meal.calories[type]
    }
    return totals
  }, {})
}

export default Meal
