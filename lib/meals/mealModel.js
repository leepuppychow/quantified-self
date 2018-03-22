class Meal {
  constructor({ id, name, foods }){
    this.id = id
    this.name = name
    this.foods = foods
    this.calculateCalories()
  }

  calculateCalories() {
    const goal = Meal.goals[this.name]
    const consumed = this.foods.reduce((sum, food) => sum + food.calories, 0)
    const remaining = goal - consumed
    this.calories = { goal, consumed, remaining }
  }

  sign(calories){
    calories < 0 ? 'negative' : 'positive'
  }

  renderTab() {
    `<button class="tab" data-id="${this.id}">${this.name}</button>`
  }

  renderTable() {
    `
      <table class="meal-table" data-id="${this.id}">
        <thead>
          <tr>
            <th>Name</th>
            <th>Calories</th>
          </tr>
        </thead>
        <tbody>

        </tbody>
      </table>
    `
  }

  renderTableBody() {
    const { remaining, consumed } = this.calories
    return `
      <tbody>
        ${this.foods.map(renderMealFood)}
        <tr>
          <td>Total Calories</td>
          <td class="total-calories">${consumed}</td>
        </tr>
        <tr>
          <td>Remaining Calories</td>
          <td class="${this.sign(remaining)}">${remaining}</td>
        </tr>
      </tbody>
    `
    // <td id="breakfast-remaining-calories">${remaining}</td>
  }

  renderMealFood(food) {
    return `
      <tr>
        <td>${food.name}</td>
        <td>${food.calories}</td>
      </tr>
    `
  }

  renderAddToMealButton() {
    `<button data-id="${this.id}" class="add-meal-button">${this.name}</button>`
  }

}

Meal.goals = {
  Breakfast: 400,
  Snack: 200,
  Lunch: 600,
  Dinner: 800,
}

export default Meal
