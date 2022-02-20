
// async function getData(url){
//     const resp = await fetch(url, {
//         headers: {
//             "x-messari-api-key": 'e3f20c0c-a584-4bd2-be5c-f5571d2f4265'
//         }
//     })
//     const respData = await resp.json();
//     console.log(respData);
//     console.log(respData.data.market_data.price_usd);
// }

// getData(link);

// SELECTORS AND VARS
const addBtn = document.querySelector('.buttonSave')
console.log(addBtn)
const tokenName = document.querySelector('#name')
console.log(tokenName)
const tokenEnterPrice = document.querySelector('#enter')
const tokenEnterAmount = document.querySelector('#amount')
// const link = 'https://data.messari.io/api/v1/assets/btc/metrics'

// FUNCTIONS
function render (coin, buyPrice, curPrice) {
  const newElem = document.createElement('li')
  const itemsBlock = document.querySelector('.items')
  newElem.innerHTML = `<li class='item'>
    <div class="buy-info">
        Coin Name 
    <div class="coin-name">
        <p>${coin}</p>
    </div>
    <div>
        <p>Bought at:</p>
        <span class="buy-price">${buyPrice}</span>
        
        <button>X</button>
    </div>
    </div>
    <div class="sell-info">
        <div class="profit">
            <div class="cur-price">
                current price:
                <p>${curPrice}</p>
            </div>
            <div class="result">
                Your result:
            </div>
        </div>
    </div>
</li>`
  itemsBlock.appendChild(newElem)
}
async function getData (url) {
  const resp = await fetch(url, {
    headers: {
      'x-messari-api-key': 'e3f20c0c-a584-4bd2-be5c-f5571d2f4265'
    }
  })
  const respData = await resp.json()

  return respData.data.market_data.price_usd
}
// DOM OPS

addBtn.addEventListener('click', (e) => {
  e.preventDefault()
  getData(`https://data.messari.io/api/v1/assets/${tokenName.value}/metrics`).then(price => {
    render(tokenName.value, tokenEnterAmount.value, price)
  })

  //
  // render(tokenName.value, tokenEnterAmount.value, getData(`https://data.messari.io/api/v1/assets/${tokenName.value}/metrics`))
})
