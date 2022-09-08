/* 1. Feladat 
- Adott 3 json fájl:  `users1`, `users2`, és `users3` névvel.  
- Mindegyik fájl felhasználók nevét, és életkorát tartalmazza az
- Írd meg a `request`, `handleError`, `handleLoad` függvények törzsét az `ajaxRequest.js`
 fájlban!
- A `request` egy xmlHttp kérést indít az adott erőforrás elérésére az adott metódussal.  
- Az `onload` eseményre a `handleLoad` függvény fusson le.
- Ha az adott erőforrás nem elérhető, próbálja meg még `retryCount` alkalommal elérni azt. 
- Két hívás között legyen `delay` ezredmásodperc várakozási idő. 
- Ha az erőforrás elérhető volt, akkor a `successCallback` függvényt kell meghívni, ez paraméterként a `responseText`-et kapja meg.
- Ha `retryCount` alkalommal sem lehet  elérni az erőforrást, meg kell hívni a `handleError` függvényt, a paraméter ilyenkor: `Resource not avaiable: ${url}`
- Az `onerror` eseménynél a `handleError` függvényt kell meghívni, paraméterként az `Error` objektum `message` propertyjét átadva.
- Csak a 3 függvényt törzsét írd meg!
- Használd fel a már megírt két `store` fájlt a megoldáshoz!
- Új függvényeket nem kell létrehoznod!
- A `main` fájl már készen van! */
import { state, actions } from './store/ajaxRequest.js';

/**
 * Represents a request factory
 * @param {Object}                    - request properties object
 * @param {string} url                - the request url
 * @param {function} successCallback  - run, when request status is  200 and state is 4
 * @param {string} [method=GET]       - the request method
 * @param {number} [maxRetry=2]       - how many times to retry send the request
 * @param {number} [delay=5000]       - the delay in milisec beetween two retry
 * @returns {function}                - the reqeust function, witch send the request
 */
function ajaxRequest({
  url,
  successCallback,
  method = 'GET',
  delay = 5000,
  maxRetry = 2,
  retryCount = 3,
} = {}) {
  actions.initRequest(maxRetry, delay);

  /**
   * Log error message to the console.error
   * @param {string} message - the error message
   */
  function handleError(message) {
    console.log("ERROR:", message);
  }

  /**
   * Handle ajax onload event
   * @param {Object} xhr - the error message
   */
  function handleLoad(xhr) {
    console.log(("Loaded", xhr));
    successCallback(xhr.response);
  }

  /**
   * Send ajax request
   */
  function request() {
    let xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.onload = (e) => handleLoad(e.target);
    xhr.onerror = (e) => {
      if (e.target.status === 404) {
        retryCount -= 1;
        if (retryCount === 0) {
          handleError(`Resource not avaiable: ${url}`);
        } else {
          const to = setTimeout(() => {
            clearTimeout(to);
            request();
          }, delay);
        }
      } else {
        handleError(e.message);
      }
    };
    xhr.send();
  }

  return request;
  };

  


export default ajaxRequest;
