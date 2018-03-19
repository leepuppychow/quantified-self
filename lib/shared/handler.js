import $ from 'jquery'

class Handler {

  handleFilterKeyup(_event) {
    const term = this.$.inputs.filter.val()
    $('td.name').each((_index, td) => {
      const isMatch = td.innerHTML.toLowerCase().startsWith(term.toLowerCase())
      $(td).closest('tr').toggle(isMatch)
    })
  }
}

export default Handler
