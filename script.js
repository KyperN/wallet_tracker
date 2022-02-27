document.addEventListener('DOMContentLoaded', () => {
    // SELECTORS AND VARS
    const addBtn = document.querySelector('.buttonSave')
    const tokenName = document.querySelector('#name')
    const tokenBuyPrice = document.querySelector('#enter')
    const tokenEnterAmount = document.querySelector('#amount')
    const tokenAmount = document.querySelector('.token-amount')
    const curPrice = document.querySelector('.cur-price')
    const refreshBtn = document.querySelector('.refresh button')
    let recordsData = []

    if (localStorage.getItem('records') !== null) {
        recordsData = JSON.parse(localStorage.getItem('records'))
        render(recordsData);
    }

    // FUNCTIONS
    function checkNameInput(input) {
        const letters = /^[A-Za-z]+$/
        if (!input.value.match(letters)) {
            alert('Please enter only letters')
            input.value = ''
        }
    };

    function countCurrentValue(tokenAmount, curPrice) {
        return (tokenAmount * curPrice).toFixed(2)
    }

    function profitOrLossText(buyPrice, curPrice) {
        switch (true) {
            case +curPrice - +buyPrice > 0:
                return 'You gained:'
            case +curPrice - +buyPrice < 0:
                return 'Your loss:'
        }
    };

    function profitOrLossStyle(buyPrice, curPrice) {
        switch (true) {
            case +curPrice - +buyPrice > 0:
                return 'green'
            case +curPrice - +buyPrice < 0:
                return 'red'
        }
    };

    function calculateTokens(buyPrice, enterPrice) {
        return (+enterPrice / +buyPrice).toFixed(3)
    }

    function removeSpinner(selector) {
        document.querySelector(selector).style.visibility = 'hidden'
    }

    function addSpinner(selector) {
        document.querySelector(selector).style.visibility = 'visible'
    }

    function render(recordsData) {
        addSpinner('.loader');
        const itemsBlock = document.querySelector('.items');
        itemsBlock.innerHTML = '';

        recordsData.forEach(record => {
            const newElem = document.createElement('li');
            const [coin, buyPrice, enterPrice, curPrice] = [record.coinName, record.buyingPrice, record.invested, record.curPrice]

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
              </div>
          </div>
      </li>`
            itemsBlock.appendChild(newElem)
        })
        removeSpinner('.loader')
    };

    async function getMetrics(coinName) {
        const url = `https://data.messari.io/api/v1/assets/${coinName}/metrics`;
        const resp = await fetch(url, {
            headers: {
                'x-messari-api-key': 'e3f20c0c-a584-4bd2-be5c-f5571d2f4265'
            }
        })
        const respData = await resp.json()
        return respData.data.market_data.price_usd
    }

    // DOM OPS
    tokenName.addEventListener('input', () => {
        checkNameInput(tokenName)
    });

    addBtn.addEventListener('click', async (e) => {
        e.preventDefault()
        addSpinner('.loader')
        checkNameInput(tokenName);

        const price = await getMetrics(tokenName.value.toLowerCase());

        const record = {
            coinName: tokenName.value,
            buyingPrice: tokenBuyPrice.value,
            invested: tokenEnterAmount.value,
            curPrice: Math.round(price)
        }

        recordsData.push(record);
        localStorage.setItem('records', JSON.stringify(recordsData))
        render(recordsData);
        removeSpinner('.loader')

    });

    refreshBtn.addEventListener('click', () => {
        addSpinner('.loader')
        localStorage.removeItem('records');

        recordsData.forEach(async (record, index) => {
            const {coinName} = record
            const price = await getMetrics(coinName);
            recordsData[index].curPrice = price;
            render(recordsData);
            localStorage.setItem('records', JSON.stringify(recordsData));
            removeSpinner('.loader');
        })
    })

})
