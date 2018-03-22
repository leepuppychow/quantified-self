class Food {

  constructor({ id, name, calories }) {
    this.id = id
    this.name = name
    this.calories = calories
  }

  renderCheckBox() {
    !Food.onMealPage ? '' : '<td><input type="checkbox"></td>'
  }

  renderDeleteButton() {
    Food.onMealPage ? '' : '<td><button class="delete">x</button></td>'
  }

  render() {
    return `
      <tr data-id="${this.id}">
        ${this.renderCheckBox()}
        <td class="data name" data-field="name">${this.name}</td>
        <td class="data" data-field="calories">${this.calories}</td>
        ${this.renderDeleteButton()}
      </tr>
    `
  }

}

export default Food
