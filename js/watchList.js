function renderWatchlist() {
    let watchlistHTML = "";
    const clickedCoins = JSON.parse(localStorage.getItem('clickedCoins')) || [];
    console.log(clickedCoins, "clickedCoins");

    if (!Array.isArray(clickedCoins)) {
        console.error("Invalid data format in clickedCoins.");
        return;
    }

    for (let i = 0; i < clickedCoins.length; i++) {
        const coin = clickedCoins[i];
        if (!coin || typeof coin !== 'object') {
            console.error("Invalid coin object at index", i);
            continue; // Skip to the next iteration if the coin object is invalid
        }
        const coinSymbol = coin.symbol || 'N/A';
        const coinPrice = coin.quote?.USD?.price || 'N/A';
        const priceFormatted = coinPrice.toLocaleString('en-US', { maximumFractionDigits: 2 });
        const percentChange1h = coin.quote?.USD?.percent_change_1h.toFixed(2) || 'N/A';
        const percentChange24h = coin.quote?.USD?.percent_change_24h.toFixed(2) || 'N/A';
        const percentChange7d = coin.quote?.USD?.percent_change_7d.toFixed(2) || 'N/A';
        const marketCap = "$" + Math.floor(coin.quote?.USD?.market_cap).toLocaleString() || 'N/A';
        const volume24h = "$" + Math.floor(coin.quote?.USD?.volume_24h).toLocaleString() || 'N/A';
        const circulatingSupply = Math.floor(coin.circulating_supply).toLocaleString() + " " + coinSymbol;

        watchlistHTML += `
        <tr>
            <td class="priority-1" id="favorite">
                <button class="fav-button" onclick="removeFromWatchlist(${i})"> 
                <img
                src="../assets/images/star.png"
                width="20"
                height="19"
                alt=""
                class="star-img"
              />
                </button>
            </td>
            <td  id="rank">${i + 1}</td>
            <td class="priority-1 coin-name-col" id="name">
                <img class="coin-img-size" src='https://s2.coinmarketcap.com/static/img/coins/64x64/${coin.id}.png' alt="">
                <span>${coin.name || 'N/A'}</span>
            </td>
            <td class="priority-1" id="symbol">${coinSymbol}</td>
            <td class="priority-1" id="price">${"$" + priceFormatted}</td>
            <td class="priority-1" id="1h">${percentChange1h}%</td>
            <td class="priority-2" id="24h">${percentChange24h}%</td>
            <td class="priority-2" id="7d">${percentChange7d}%</td>
            <td class="priority-2" id="market-cap">${marketCap}</td>
            <td class="priority-2" id="volume">${volume24h}</td>
            <td class="priority-2" id="circulating-supply">${circulatingSupply}</td>
        </tr>`;
    
    }

    const watchlistTable = document.getElementById("table-data");
    if (!watchlistTable) {
        console.error("Element with id 'watchlist-data' not found.");
        return;
    }

    if (watchlistHTML === "") {
        watchlistTable.innerHTML = "<tr><td colspan='11'>No coins selected</td></tr>";
    } else {
        watchlistTable.innerHTML = watchlistHTML;
    }
}

function removeFromWatchlist(index) {
    let clickedCoins = JSON.parse(localStorage.getItem('clickedCoins')) || [];
    clickedCoins.splice(index, 1);
    localStorage.setItem('clickedCoins', JSON.stringify(clickedCoins));
    renderWatchlist();
}

document.addEventListener("DOMContentLoaded", function () {
    renderWatchlist();
});

// function redirectToWatchList(index) {
//     // Your logic to toggle favorite icon color goes here
//     const favoriteIcon = document.querySelector(`#watchlist-data tr:nth-child(${index + 1}) .favorite-icon`);
//     favoriteIcon.classList.toggle("yellow");
//   }
