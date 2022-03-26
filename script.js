const items = document.querySelector('.items');
const cartItems = document.querySelector('.cart__items');
const totalPrice = document.querySelector('.total-price');
let cart = [];

function criaCarregando() {
  const loading = document.createElement('h1');
  loading.className = 'loading';
  items.appendChild(loading);
}

function removeCarregando() {
  const loading = document.querySelector('.loading');
  loading.remove();
}

function totalCart() {
  const total = cart.reduce((acc, curr) => {
    let accumulator = acc;
    accumulator += curr.salePrice;

    return accumulator;
  }, 0);

  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total);
}

function cartItemClickListener(event) {
  const sku = event.target.innerText.split(' ')[1];
  event.target.remove();
  cart = cart.filter((item) => item.sku !== sku);
  saveCartItems(JSON.stringify(cart));
  totalPrice.innerText = totalCart();
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function adicionaProdutoCarrinho(event) {
  const { id: sku, title: name, price: salePrice } = await fetchItem(
    getSkuFromProductItem(event.target.parentElement),
    );
    cart.push({ sku, name, salePrice });
    saveCartItems(JSON.stringify(cart));
    totalPrice.innerText = totalCart();
    cartItems.appendChild(createCartItemElement({ sku, name, salePrice }));
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const btnAddItem = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  section.appendChild(btnAddItem);

  btnAddItem.addEventListener('click', adicionaProdutoCarrinho);

  return section;
}

async function carregarItens(filter) {
  criaCarregando();
  const products = await fetchProducts(filter);
  products.results.forEach((product) => {
    const item = createProductItemElement(
      { sku: product.id, name: product.title, image: product.thumbnail },
      );
    items.appendChild(item);
  });
  removeCarregando();
}

function limpaCarrinho() {
  cart = [];
  cartItems.innerHTML = '';
  saveCartItems(JSON.stringify(cart));
  totalPrice.innerText = totalCart();
}

function carregaItensDoStorage() {
  const storage = JSON.parse(getSavedCartItems());
  if (storage) {
    storage.forEach((item) => {
      const li = createCartItemElement(item);
      cart = storage;
      cartItems.appendChild(li);
      totalPrice.innerText = totalCart();
    });
  }
}

window.onload = () => {
  carregarItens('computador');
  carregaItensDoStorage();
  document.querySelector('.empty-cart').addEventListener('click', limpaCarrinho);
  totalPrice.innerText = totalCart();
};