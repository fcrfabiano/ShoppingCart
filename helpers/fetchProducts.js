const fetchProducts = (filter) => (!filter 
    ? new Error('You must provide an url') 
    : fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${filter}`)
    .then((response) => response.json())
    .then((data) => data)
    .catch((error) => error));
  
  if (typeof module !== 'undefined') {
    module.exports = {
      fetchProducts,
    };
  }