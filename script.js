const items = document.querySelector('.items');
const cartItems = document.querySelector('.cart__items');
const totalPrice = document.querySelector('.total-price');
let cart = [];

function criaCarregando() {
  const loading = document.createElement('h1');
  loading.className = 'loading';
  items.appendChild(loading);
  document.querySelector('.empty-cart').style.cursor = 'not-allowed';
}

function removeCarregando() {
  const loading = document.querySelector('.loading');
  loading.remove();
  document.querySelector('.empty-cart').style.cursor = 'pointer';
}

function toReal(total) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total);
}

function toRealString(total) {
  return parseFloat(total.toFixed(2)).toLocaleString('pt-BR', {
    currency: 'BRL',
    minimumFractionDigits: 2
  });
}

function totalCart() {
  return cart.reduce((acc, curr) => {
    let accumulator = acc;
    accumulator += curr.salePrice;

    return accumulator;
  }, 0);
}
function cartItemClickListener(event) {
  const id = event.target.parentElement.firstChild.innerText;
  event.target.parentElement.remove();
  cart = cart.filter((item) => item.id !== id);
  saveCartItems(JSON.stringify(cart));
  totalPrice.innerHTML= toReal(totalCart());
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

function criaElemento(elemento = 'div', className = '', texto = '') {
  const newElemento = document.createElement(elemento);
  newElemento.className = className;
  newElemento.innerText = texto;
  return newElemento;
}

function createCartItemElement({ id, name, salePrice, image }) {
  const li = document.createElement('li');
  li.className = 'cart__item__flex';
  const sku = criaElemento('div', '', id);
  sku.style.display = 'none';
  const img = createProductImageElement(image);
  img.className = 'cart__item__img';
  const descContainer = criaElemento('div', 'cart__item__description__container');
  const prodName = criaElemento('span', '', name);
  const prodPrice = criaElemento('span', 'cart__item__price', toReal(salePrice));
  const close = createProductImageElement('./assets/xmark-solid.svg');
  close.className = 'cart__item__close';
  li.appendChild(sku);
  li.appendChild(img);
  descContainer.appendChild(prodName);
  descContainer.appendChild(prodPrice);
  li.appendChild(descContainer);
  li.appendChild(close);
  close.addEventListener('click', cartItemClickListener);

  return li;
}
async function adicionaProdutoCarrinho(event) {
  const { id: sku, title: name, price: salePrice, thumbnail: image } = await fetchItem(
    getSkuFromProductItem(event.target.parentElement),
    );
    const id = uuidv4();
    cart.push({ id, sku, name, salePrice, image });
    saveCartItems(JSON.stringify(cart));
    totalPrice.innerHTML= toReal(totalCart());
    cartItems.appendChild(createCartItemElement({ id, name, salePrice, image }));
}

function createProductItemElement({ sku, name, image, price }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('span', 'item__title', name));
  const preco = createCustomElement('span', 'item__price');
  preco.innerHTML = `<span>R$ </span><strong>${toRealString(price)}</strong>`;
  section.appendChild(preco);
  const btnAddItem = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  section.appendChild(btnAddItem);

  btnAddItem.addEventListener('click', adicionaProdutoCarrinho);

  return section;
}

async function carregarItens(filter) {
  criaCarregando();
  try {
    const products = await fetchProducts(filter);
    products.results.forEach((product) => {
      const item = createProductItemElement(
        { sku: product.id, name: product.title, image: product.thumbnail, price: product.price },
        );
      items.appendChild(item);
    });
    removeCarregando();
  } catch (error) {
    console.log(error.message);
  }
}

function limpaCarrinho() {
  cart = [];
  cartItems.innerHTML = '';
  saveCartItems(JSON.stringify(cart));
  totalPrice.innerHTML= toReal(totalCart());
}

function carregaItensDoStorage() {
  const storage = JSON.parse(getSavedCartItems());
  if (storage) {
    storage.forEach((item) => {
      const li = createCartItemElement(item);
      cart = storage;
      cartItems.appendChild(li);
      totalPrice.innerHTML= toReal(totalCart());
    });
  }
}

window.onload = () => {
  carregarItens('computador');
  carregaItensDoStorage();
  document.querySelector('.empty-cart').addEventListener('click', limpaCarrinho);
  totalPrice.innerHTML= toReal(totalCart());
};