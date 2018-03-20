import $ from 'jquery';

class Handler {

  handleFilterKeyup(event) {
    const term = this.$.inputs.filter.val().toLowerCase()
    $('td.name').each((_index, td) => {
      $(td).closest('tr').toggle(td.innerHTML.toLowerCase().startsWith(term))
    })
  }
}

export default Handler
