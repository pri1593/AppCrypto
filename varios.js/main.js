const tbody = document.querySelector('tbody');
const prevBTN = document.querySelector('.left');
const nextBTN = document.querySelector('.right');
const pageNumber = document.querySelector('.page-number');
const form = document.getElementById('form');
const searchInput = document.querySelector('.input-search');
const top100 = document.querySelector('top-100');
const btnContainer = document.querySelector('.pagination');

// Render html
const renderCoin = (coin) => {
// Desestructurar objeto
const {
    rank,
    market_cap_usd,
    name,
    symbol,
    price_usd,
    volumen24,
    percent_change_24h,
    percent_change_7d,
} = coin;
return ` <tr>
<td>#${rank}</td>
<td class="coin-title">${name} (${symbol.toUpperCase()})</td>
<td>$${price_usd}</td>
<td>$${market_cap_usd}</td>
<td>$${volumen24}</td>
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
}
const resetCount = coins =>{
    prev = coins.prev;
    current = coins.current;
    next = coins.next;
    total = coins.total;
    results = coins.results;
}


const loadCoins = async e =>{
    e.preventDefault();
    const searchedValue = searchInput.value.trim();
    let coins = await requestCoins(searchedValue);
    
    resetCount(coins);
    if(searchedValue){
        top100.classList.remove('hidden');
        form.reset();
    } else {
        // top100.classList.add('hidden');
    };
    // pageNumber.innerHTML = current + 1;
    renderCoins(results, current);

};


const init = () => {
    window.addEventListener('DOMContentLoaded', loadCoins);
    form.addEventListener('submit', loadCoins);
};

init()
