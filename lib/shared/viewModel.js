class ViewModel {}

ViewModel.initialize = function(){
  this.data = new Map()
}

ViewModel.insert = function(raw) {
  const wrapped = new this(raw)
  this.data.set(raw.id, wrapped)
  return wrapped
}

ViewModel.find = function(id) {
  return this.data.get(id)
}

ViewModel.delete = function(id) {
  this.data.delete(id)
}

ViewModel.all = function() {
  return [...this.data.values()]
}

export default ViewModel
