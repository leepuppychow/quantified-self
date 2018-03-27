import $ from 'jquery'

class Handler {

  constructor() {
    this.$ = this.grabElements()
  }

  listen() {
    this.$.filterForm.keyup(this.handleFilterKeyup)
    this.$.filterForm.submit(e => e.preventDefault())
  }

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
      filterForm: $(`form input[name="filter"]`),
      foods: $('table.foods tbody'),
      errors: $('#errors'),
    }
  }
}

export default Handler
