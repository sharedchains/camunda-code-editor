/**
 * Simple API class that calls our language executor, returning its result
 */
export default class GroovyAPI {

  constructor(restEndpoint) {
    this.restEndpoint = restEndpoint;
  }

  async executeGroovy(payload) {
    const headers = {
      accept: 'application/json'
    };

    let res;

    try {
      res = await fetch(this.restEndpoint + '/groovy/execute', {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        return { error: `${res.status} ${res.statusText}` };
      }

      return res.json();
    } catch (error) {
      return {
        error: `Unexpected error calling executor: ${error}`
      };
    }
  }


  async executeGroovyVectors(payload) {
    const headers = {
      accept: 'application/json'
    };

    let res;

    try {
      res = await fetch(this.restEndpoint + '/groovy/execute/vectors', {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        return { error: `${res.status} ${res.statusText}` };
      }

      return res.json();
    } catch (error) {
      return {
        error: `Unexpected error calling executor: ${error}`
      };
    }
  }

}