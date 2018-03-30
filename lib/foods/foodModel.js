import ViewModel from '../shared/ViewModel'

class Food extends ViewModel {

  constructor({ id, name, calories }) {
    super()
    this.id = id
    this.name = name
    this.calories = calories
  }

  renderCheckBox() {
    return !Food.onMealPage ? '' : '<td><input type="checkbox" aria-label="add to meal"></td>'
  }

  renderDeleteButton() {
    return Food.onMealPage ? '' : `
      <td><button class="delete" aria-label="delete">
        <i class="material-icons">delete_forever</i>
      </button></td>
    `
  }

  render() {
    return `
      <tr data-id="${this.id}">
        ${this.renderCheckBox()}
        ${this.renderDeleteButton()}
        <td><p data-field="name">${this.name}</p></td>
        <td><p data-field="calories">${this.calories}</p></td>
      </tr>
    `
  }

}

Food.initialize()

export default Food
