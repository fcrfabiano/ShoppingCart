require('../mocks/fetchSimulator');
const { fetchItem } = require('../helpers/fetchItem');
const item = require('../mocks/item');

describe('2 - Teste a função fecthItem', () => {
  it('Testa se fetchItem é uma função', () => {
    expect(typeof fetchItem).toBe('function');
  });

  it('Executa a função fetchItem com o argumento do item "MLB1615760527" e teste se fetch foi chamada', async () => {
    const sku = 'MLB1615760527';
    await fetchItem(sku);
    expect(fetch).toHaveBeenCalled();
  });

  it('Testa se, ao chamar a função fetchItem com o argumento do item "MLB1615760527", a função fetch utiliza o endpoint "https://api.mercadolibre.com/items/MLB1615760527"', async () => {
    const sku = "MLB1615760527";
    const url = `https://api.mercadolibre.com/items/${sku}`;
    await fetchItem(sku);
    expect(fetch).toHaveBeenCalledWith(url);
  });

  it('Teste se o retorno da função fetchItem com o argumento do item "MLB1615760527" é uma estrutura de dados igual ao objeto item que já está importado no arquivo', async () => {
    const actual = await fetchItem( "MLB1615760527");
    expect(actual).toEqual(item);
  });

  it('Teste se, ao chamar a função fetchItem sem argumento, retorna um erro com a mensagem: You must provide an url', async () => {
    const actual = await fetchItem();
    expect(actual).toEqual(new Error('You must provide an url'));
  });
});