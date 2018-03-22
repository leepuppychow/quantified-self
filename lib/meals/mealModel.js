class Meal {
  constructor(id, name, foods){
    this.id = id
    this.name = name
    this.foods = foods
    this.calculateCalories()
  }

  calculateCalories() {
    const target = Meal.targets[this.name]
    const current = this.foods.reduce((sum, food) => sum + food.calories, 0)
    const remaining = target - current
    this.calories = { target, current, remaining }
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
    return `
      <tbody>
        {this.foods.map(renderMealFood)}
        <tr>
          <td>Total Calories</td>
          <td class="total-calories">${this.calories}</td>
        </tr>
        <tr>
          <td>Remaining Calories</td>
          <td id="breakfast-remaining-calories">${this.remainingCalories()}</td>
        </tr>
      </tbody>
    `
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

Meal.targets = {
  Breakfast: 400,
  Snack: 200,
  Lunch: 600,
  Dinner: 800,
}

export default Meal
