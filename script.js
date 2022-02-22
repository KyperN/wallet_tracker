document.addEventListener("DOMContentLoaded",()=>{
  // SELECTORS AND VARS
const addBtn = document.querySelector('.buttonSave')
const tokenName = document.querySelector('#name')
const tokenBuyPrice = document.querySelector('#enter')
const tokenEnterAmount = document.querySelector('#amount')
const tokenAmount = document.querySelector('.token-amount')
const curPrice = document.querySelector('.cur-price')
const arrData = []

// FUNCTIONS
function checkNameInput (input) {
  const letters = /^[A-Za-z]+$/
  if (!input.value.match(letters)) {
    alert('Please enter only letters')
    input.value = ''
  }
};


function saveData (data) {
  arrData.push(data)
}

function countCurrentValue (tokenAmount, curPrice) {
  return (tokenAmount * curPrice).toFixed(2)
}

function profitOrLossText (buyPrice, curPrice) {
  switch (true) {
    case +curPrice - +buyPrice > 0:
      return 'You gained:'
    case +curPrice - +buyPrice < 0:
      return 'Your loss:'
  }
};

function profitOrLossStyle (buyPrice, curPrice) {
  switch (true) {
    case +curPrice - +buyPrice > 0:
      return 'green'
    case +curPrice - +buyPrice < 0:
      return 'red'
  }
};

function calculateTokens (buyPrice, enterPrice) {
  return (+enterPrice / +buyPrice).toFixed(3)
};
function removeSpinner (selector) {
  document.querySelector(selector).style.visibility = 'hidden'
};
function addSpinner (selector) {
  document.querySelector(selector).style.visibility = 'visible'
};

function render (coin, buyPrice, enterPrice, curPrice) {
  const newElem = document.createElement('li')
  const itemsBlock = document.querySelector('.items')
  newElem.innerHTML = `<li class='item'>
  <div class="buy-info">
      <div>
          <span>Coin name:</span>
  <span class='coin-name'>${coin.toUpperCase()}</span>
      </div>
      
  <div>
      <span>Bought at:</span>
      <span class="buy-price">${parseInt(buyPrice)}</span>
  </div>
  <div>
  <span>Invested:</span>
<span class='coin-name'>${enterPrice}</span>
</div>
  </div>
  <div class="sell-info">
      <div class="profit">
          <div>
              <span>Worth now:</span>
              <span class="cur-price">${countCurrentValue(calculateTokens(buyPrice, enterPrice), curPrice)}</span>
          </div>
          <div>
              Token amount: <span class='token-amount'>${calculateTokens(buyPrice, enterPrice)}</span>
          </div>
          <div class="result">
              ${profitOrLossText(buyPrice, curPrice)}
              <span class="result-amount ${profitOrLossStyle(buyPrice, curPrice)}">${(countCurrentValue(calculateTokens(buyPrice, enterPrice), curPrice) - enterPrice).toFixed(2)}</span>
          </div>
          <div class='refresh'>
          <button class='refresh-btn'>refresh</button>
          </div>
      </div>
  </div>
</li>`
  itemsBlock.appendChild(newElem)
  removeSpinner('.loader')
  const refreshBtn = document.querySelectorAll('.refresh');
  refreshBtn.forEach(btn => {
    btn.addEventListener('click', () => {
    const coinName = document.querySelector('.item .coin-name');
      console.log(coinName);
    })
  })
  const record = {
    coinName: coin,
    buyingPrice: buyPrice,
    invested: enterPrice,
    curPrice: Math.round(curPrice)
  }
  arrData.push(record)
  localStorage.setItem('records', JSON.stringify(arrData))
};

if(localStorage.getItem('records') != null) {
  const data = JSON.parse(localStorage.getItem('records'))
  data.forEach((record) => {
    render(record.coinName, record.buyingPrice, record.invested, record.curPrice);
  })
  

}

async function getData (url) {
  const resp = await fetch(url, {
    headers: {
      'x-messari-api-key': 'e3f20c0c-a584-4bd2-be5c-f5571d2f4265'
    }
  })
  const respData = await resp.json()
  return respData.data.market_data.price_usd
};

// DOM OPS
tokenName.addEventListener('input', () => {
  checkNameInput(tokenName)
})
addBtn.addEventListener('click', (e) => {
  addSpinner('.loader')
  checkNameInput(tokenName)
  e.preventDefault()
  getData(`https://data.messari.io/api/v1/assets/${tokenName.value.toLowerCase()}/metrics`).then(price => {
    render(tokenName.value, tokenBuyPrice.value, tokenEnterAmount.value, Math.round(price))
  }).catch(error => {

  })
})

})
