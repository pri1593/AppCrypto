const tbody = document.querySelector('tbody');
const prevBTN = document.getElementById('left');
const nextBTN = document.getElementById('right');
const pageNumber = document.querySelector('.page-number');
const form = document.getElementById('form');
const searchInput = document.querySelector('.input-search');
const top100 = document.querySelector('.top-btn');
const btnContainer = document.querySelector('.pagination');

// Formatear numero a usd
const fomatNum = (num) =>{
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

// Formatear ,mil, millones etc
const nFormater = (numero, digito) =>{
    const symbol = [
        { value: 1, symbol: ''},
        { value: 1e3, symbol: 'k'},
        { value: 1e6, symbol: 'M'},
        { value: 1e9, symbol: 'MM'},
    ];
    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    let item = symbol
    .slice()
    .reverse()
    .find(item => {
        return numero >= item.value;
    });

    return item
    ? (numero / item.value).toFixed(digito).replace(rx, '$1') + 
    item.symbol
    : '0';
};



// Render html
const renderCoin = (coin) => {
// Desestructurar objeto
const {
    rank,
    market_cap_usd,
    name,
    symbol,
    price_usd,
    volume24,
    percent_change_24h,
    percent_change_7d,
} = coin;
return ` <tr>
<td>#${rank}</td>
<td class="coin-title">${name} (${symbol.toUpperCase()})</td>
<td>$${fomatNum(price_usd)}</td>
<td>$${nFormater(market_cap_usd)}</td>
<td>$${nFormater(volume24)}</td>
<td><span class="${percent_change_24h < 0 ? 'down' : 'up'}">${percent_change_24h}</span></td>
<td><span class="${percent_change_7d < 0 ? 'down' : 'up'}">${percent_change_7d}</span></td>
</tr>
`
};

// Render coins
const renderCoins = (coins, current) =>{
    if(!coins.length){
        tbody.innerHTML = `<h1>No se encontraron resultados</h1>`;
        top100.classList.remove('hidden');
        btnContainer.classList.add('hidden');
        form.reset();
        return;
    }

    btnContainer.classList.remove('hidden');
    tbody.innerHTML = coins[current].map(renderCoin).join('');
};

// Desabilita el boton prev
const disablePreviousBTN = prev =>{
    if(prev === null){
        prevBTN.classList.add('disabled')
    } else {
        prevBTN.classList.remove('disabled')
    }

};

// Desabilitar boton next
const disableNextBTN = (next, total) =>{
    if(next === total){
        nextBTN.classList.add('disabled');
    } else {
        nextBTN.classList.remove('disabled');
    }

};

const resetCount = coins =>{
    prev = coins.prev;
    current = coins.current;
    next = coins.next;
    total = coins.total;
    results = coins.results;
};


const loadCoins = async e =>{
    e.preventDefault();
    const searchedValue = searchInput.value.trim();
    let coins = await requestCoins(searchedValue);
    
    resetCount(coins);
    if(searchedValue){
        top100.classList.remove('hidden');
        form.reset();
    } else {
        top100.classList.add('hidden');
    };
    pageNumber.innerHTML = current + 1;
    renderCoins(results, current);
    disablePreviousBTN(prev);
    disableNextBTN(next, total);
    // Escuchador para next
    nextBTN.addEventListener('click' , e =>{
        e.stopImmediatePropagation();
        if(next === total) return;
        prev = current;
        current = next;
        next += 1;
        renderCoins(results, current);
        pageNumber.innerHTML = current + 1;
        disablePreviousBTN(prev);
        disableNextBTN(next, total);

    });

    // Escuchador para prev
    prevBTN.addEventListener('click', e =>{
        e.stopImmediatePropagation();
        if(prev === null) return;
        current -= 1;
        prev = prev === 0 ? null : prev - 1;
        next -= 1;
        renderCoins(results, current);
        pageNumber.innerHTML = current + 1;
        disablePreviousBTN(prev);
        disableNextBTN(next, total);
        
    });
};
//  const showTop100 = () =>{
//     loadCoins();
//  };

const init = () => {
    window.addEventListener('DOMContentLoaded', loadCoins);
    form.addEventListener('submit', loadCoins);
    top100.addEventListener('click', loadCoins)

};

init()
