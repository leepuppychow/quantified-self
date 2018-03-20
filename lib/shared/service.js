class ServiceError extends Error{}

class Service {

  baseUrl() {
    return 'https://quantified-self-rails-api.herokuapp.com/api/v1/'
  }

  fetch(path, options){
    return fetch(this.baseUrl() + path, options)
      .then(this.checkOK)
      .then(this.parseIfJson)
  }

  send(method, path, data) {
    const headers = { 'Content-Type': 'application/json' }
    const body = JSON.stringify(data)
    return this.fetch(path, { body, headers, method })
  }

  checkOK(res) {
    if (res.ok) return res
    throw(new ServiceError(`${res.status}: ${res.statusText}`))
  }

  parseIfJson(res) {
    return res.text().then(text => text && JSON.parse(text))
  }

}

export default Service
