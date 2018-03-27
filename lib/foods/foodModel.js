import ViewModel from '../shared/ViewModel'

class Food extends ViewModel {

  constructor({ id, name, calories }) {
    super()
    this.id = id
    this.name = name
    this.calories = calories
  }

  renderCheckBox() {
    !Food.onMealPage ? '' : '<td><input type="checkbox"></td>'
  }

  renderDeleteButton() {
    Food.onMealPage ? '' : `
      <td><button class="delete"><button class="delete">
        <i class="material-icons">delete_forever</i>
      </button></button></td>
    `
  }

  render() {
    return `
      <tr data-id="${this.id}">
        ${this.renderCheckBox()}
        <td class="data" data-field="name">${this.name}</td>
        <td class="data" data-field="calories">${this.calories}</td>
        ${this.renderDeleteButton()}
      </tr>
    `
  }

}

Food.initialize()

export default Food
