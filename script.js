
// SELECTORS AND VARS
const addBtn = document.querySelector('.buttonSave')
const tokenName = document.querySelector('#name')
const tokenEnterPrice = document.querySelector('#enter')
const tokenEnterAmount = document.querySelector('#amount')

// FUNCTIONS
function profitOrLoss (buyPrice, curPrice) {
  console.log(+curPrice - +buyPrice)
  switch (true) {
    case +curPrice - +buyPrice > 0:
      return 'green'
    case +curPrice - +buyPrice < 0:
      return 'red'
  }
}

function removeSpinner (selector) {
  document.querySelector(selector).style.visibility = 'hidden';
}
function addSpinner (selector) {
  document.querySelector(selector).style.visibility = 'visible';
}

function render (coin, buyPrice, curPrice) {
  const newElem = document.createElement('li')
  const itemsBlock = document.querySelector('.items')
  newElem.innerHTML = `<li class='item'>
    <div class="buy-info">
        Coin Name 
    <div class="coin-name">
        <p>${coin.toUpperCase()}</p>
    </div>
    <div>
        <p>Bought at:</p>
        <span class="buy-price">${parseInt(buyPrice)}</span>
        
        <button>x</button>
    </div>
    </div>
    <div class="sell-info">
        <div class="profit">
            <div class="cur-price">
                current price:
                <p>${parseInt(curPrice)}</p>
            </div>
            <div class="result ${profitOrLoss(buyPrice, curPrice)}">
                Your result:
                ${parseInt(curPrice) - parseInt(buyPrice)}
            </div>
        </div>
    </div>
</li>`
  itemsBlock.appendChild(newElem)
  removeSpinner('.loader')
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
  addSpinner('.loader')
  e.preventDefault()
  // addSpinner('.loader')
  getData(`https://data.messari.io/api/v1/assets/${tokenName.value}/metrics`).then(price => {
    render(tokenName.value, tokenEnterPrice.value, Math.round(price))
  })

  //
  // render(tokenName.value, tokenEnterAmount.value, getData(`https://data.messari.io/api/v1/assets/${tokenName.value}/metrics`))
})
