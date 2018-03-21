class Food {

  constructor({ id, name, calories }) {
    this.id = id
    this.name = name
    this.calories = calories
  }

  render() {
    return `
      <tr data-id="${this.id}">
        <td class="check-box"><input class="food-checkbox" data-food-id="${this.id}" type="checkbox"></td>
        <td class="data name" data-field="name">${this.name}</td>
        <td class="data" data-field="calories">${this.calories}</td>
        <td>
          <button class="delete">x</button>
        </td>
      </tr>
    `
  }

}

Food.sortOptions = {
  0: (a, b) => a.id - b.id,
  1: (a, b) => b.calories - a.calories,
  2: (a, b) => a.calories - b.calories,
}

export default Food
