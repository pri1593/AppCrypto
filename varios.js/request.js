const requestCoins = async value =>{
    const baseURL = 'https://api.coinlore.net/api/tickers/?start=0&limit=100';
    const response = await fetch(baseURL);
    const json = await response.json();
    const data = json.data;
    // console.log(data)
    const results = value
        ? chunkArrayiInGroups(data.filter(coin => coin.name.toLowerCase().includes(value.toLowerCase())), 10
        )

        : chunkArrayiInGroups(data, 10);

        return{
            results: results,
            total: results.length,
            current: 0,
            prev: null,
            next:1,
        }
};      
// requestCoins();
const chunkArrayiInGroups = (arr, size) =>{
    let chunk = [];
    for(let i = 0; i < arr.length; i += size){
        chunk.push(arr.slice(i, i += size))
    }
    console.log(chunk)
    return chunk;

    
};


