const saveCartItems = (cartItem) => localStorage.setItem('cartItems', cartItem);
  
  if (typeof module !== 'undefined') {
    module.exports = saveCartItems;
  }