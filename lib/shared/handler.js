import $ from 'jquery'

class Handler {

  handleFilterKeyup(_event) {
    const term = this.$.inputs.filter.val()
    $('td.name').each((_index, td) => {
      const isMatch = td.innerHTML.toLowerCase().startsWith(term.toLowerCase())
      $(td).closest('tr').toggle(isMatch)
    })
  }

  grabElements() {
    return {
      body: $(document.body),
      inputs: {
        name: $(`form input[name="name"]`),
        calories: $(`form input[name="calories"]`),
        filter: $(`form input[name="filter"]`),
      },
      addFood: $('form.add-food'),
      data: $('table.foods tbody'),
      errors: $('.errors'),
      tabs: $('.tab'),
      tables: $('.meal-table'),
      newFood: $('#new-food-button'),
      addMeal: $('.add-meal-button'),
      sortByCalories: $('#sort-by-calories'),
    }
  }
}

export default Handler
