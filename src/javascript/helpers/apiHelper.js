const API_URL = "https://street-fighter-srvr.herokuapp.com/";

function callApi(endpoind, method, data) {
  const url = API_URL + endpoind;
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: "admin"
    }
  };

  if (method === "PUT") {
    return fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: "admin"
      },
      body: JSON.stringify(data)
    })
      .then(response =>
        response.ok ? response.json() : Promise.reject(Error("Failed to load"))
      )
      .catch(error => {
        throw error;
      });
  }
  return fetch(url, options)
    .then(response =>
      response.ok ? response.json() : Promise.reject(Error("Failed to load"))
    )
    .catch(error => {
      throw error;
    });
}

export { callApi };
