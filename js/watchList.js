function renderWatchlist() {
  let watchlistHTML = "";
  const clickedCoins = JSON.parse(localStorage.getItem("clickedCoins")) || [];
  console.log(clickedCoins, "clickedCoins");

  if (!Array.isArray(clickedCoins)) {
    console.error("Invalid data format in clickedCoins.");
    return;
  }

  for (let i = 0; i < clickedCoins.length; i++) {
    const coin = clickedCoins[i];
    if (!coin || typeof coin !== "object") {
      console.error("Invalid coin object at index", i);
      continue; // Skip to the next iteration if the coin object is invalid
    }
    const coinSymbol = coin.symbol || "N/A";
    const coinPrice = coin.quote?.USD?.price || "N/A";
    const priceFormatted = coinPrice.toLocaleString("en-US", {
      maximumFractionDigits: 2,
    });
    const percentChange1h =
      coin.quote?.USD?.percent_change_1h.toFixed(2) || "N/A";
    const percentChange24h =
      coin.quote?.USD?.percent_change_24h.toFixed(2) || "N/A";
    const percentChange7d =
      coin.quote?.USD?.percent_change_7d.toFixed(2) || "N/A";
    const marketCap =
      "$" + Math.floor(coin.quote?.USD?.market_cap).toLocaleString() || "N/A";
    const volume24h =
      "$" + Math.floor(coin.quote?.USD?.volume_24h).toLocaleString() || "N/A";
    const circulatingSupply =
      Math.floor(coin.circulating_supply).toLocaleString() + " " + coinSymbol;

    watchlistHTML += `
            <tr>
                <td id="favorite"><button class="fav-button" onclick="removeFromWatchlist(${i})"><i class="fa-regular fa-star"></i></button></td>
                <td id="rank">${i + 1}</td>
                <td id="name"><img class="coin-img-size" src='https://s2.coinmarketcap.com/static/img/coins/64x64/${
                  coin.id
                }.png'></img><span>${coin.name || "N/A"}</span></td>
                <td id="symbol">${coinSymbol}</td>
                <td id="price">${"$" + priceFormatted}</td>
                <td id="1h">${percentChange1h}%</td>
                <td id="24h">${percentChange24h}%</td>
                <td id="7d">${percentChange7d}%</td>
                <td id="market-cap">${marketCap}</td>
                <td id="volume">${volume24h}</td>
                <td id="circulating-supply">${circulatingSupply}</td>
            </tr>`;
  }

  const watchlistTable = document.getElementById("watchlist-data");
  if (!watchlistTable) {
    console.error("Element with id 'watchlist-data' not found.");
    return;
  }

  if (watchlistHTML === "") {
    watchlistTable.innerHTML =
      "<tr><td colspan='11'>No coins selected</td></tr>";
  } else {
    watchlistTable.innerHTML = watchlistHTML;
  }
}

function removeFromWatchlist(index) {
  let clickedCoins = JSON.parse(localStorage.getItem("clickedCoins")) || [];
  clickedCoins.splice(index, 1);
  localStorage.setItem("clickedCoins", JSON.stringify(clickedCoins));
  renderWatchlist();
}

document.addEventListener("DOMContentLoaded", function () {
  renderWatchlist();
});

function redirectToWatchList(index) {
  // Your logic to toggle favorite icon color goes here
  const favoriteIcon = document.querySelector(
    `#watchlist-data tr:nth-child(${index + 1}) .favorite-icon`
  );
  favoriteIcon.classList.toggle("yellow");
}
