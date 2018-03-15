class Service {

  fetch(path, options){
    return fetch(`https://quantified-self-rails-api.herokuapp.com/api/v1/${path}`, options)
      .then(this.checkOK)
      .then(this.parseIfJson)
  }

  send(method, path, data) {
    const headers = { 'Accept': 'application/json', 'Content-Type': 'application/json' }
    const body = JSON.stringify(data)
    return this.fetch(path, { body, headers, method })
  }

  checkOK(res) {
    if (res.ok) return res;
    throw(new Error(`${res.status}: ${res.statusText}`))
  }

  parseIfJson(res) {
    return res.text().then(text => text && JSON.parse(text))
  }

}

export default Service
