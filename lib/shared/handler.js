import $ from 'jquery'

class Handler {

  constructor() {
    this.$ = this.grabElements()
    this.handleFilterKeyup = this.handleFilterKeyup.bind(this)
  }

  listen() {
    this.$.filter.keyup(this.handleFilterKeyup)
    this.$.filter.closest('form').submit(e => e.preventDefault())
  }

  handleFilterKeyup() {
    const term = this.$.filter.val()
    $('p[data-field="name"]').each((_index, p) => {
      const isMatch = p.innerHTML.toLowerCase().startsWith(term.toLowerCase())
      $(p).closest('tr').toggle(isMatch)
    })
  }

  grabElements() {
    return {
      body: $(document.body),
      filter: $(`input[name="filter"]`),
      foods: $('table.foods tbody'),
      errors: $('#errors'),
    }
  }
}

export default Handler
