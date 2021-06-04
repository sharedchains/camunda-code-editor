export default class GroovyAPI {

  constructor(restEndpoint) {
    this.restEndpoint = restEndpoint;
  }

  async executeGroovy(payload) {
    const headers = {
      accept: 'application/json'
    };

    const res = await fetch(this.restEndpoint + '/groovy/execute', {
      method: 'POST',
      headers,
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      return { error: `${res.status} ${res.statusText}` };
    }

    return res.json();
  }

}