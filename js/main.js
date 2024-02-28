// const apiKey = "ce14db1d-0bc9-43ee-b1ba-b5200094351f";
const url =
  "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest";
const mode = "no-cors";

const getData = async () => {
  try {
    console.log(url);
    const response = await fetch(url, {
      headers: {
        "X-CMC_PRO_API_KEY": apiKey,
        mode: mode,
      },
    });
    const data = await response.json();
    coinList = data.data;
    console.log(coinList);
    render();
  } catch (error) {
    console.log("error", error);
  }
};

const render = () => {
  let newsHTML = "";
  for (i = 0; i < coinList.length; i++) {
    newsHTML += `            <tr>
        <td id = "rank">${i + 1}</td>
        <td id = "name">${coinList[i]["name"]}</td>
        <td id = "symbol">${coinList[i]["symbol"]}</td>
        <td id = "price">${
          "$" +
          coinList[i]["quote"].USD["price"].toLocaleString("en-US", {
            maximumFractionDigits: 2,
          })
        }</td>
        <td id = "1h">${
          coinList[i]["quote"].USD["percent_change_1h"].toFixed(2) + "%"
        }</td>
        <td id = "24h">${
          coinList[i]["quote"].USD["percent_change_24h"].toFixed(2) + "%"
        }</td>
        <td id = "7d">${
          coinList[i]["quote"].USD["percent_change_7d"].toFixed(2) + "%"
        }</td>
        <td id = "market-cap">${
          "$" +
          Math.floor(coinList[i]["quote"].USD["market_cap"]).toLocaleString()
        }</td>
        <td id = "volume">${
          "$" +
          Math.floor(coinList[i]["quote"].USD["volume_24h"]).toLocaleString()
        }</td>
        <td id = "circulating-supply">${
          Math.floor(coinList[i]["circulating_supply"]).toLocaleString() +
          " " +
          coinList[i]["symbol"]
        }</td>
    </tr>`;
  }
  document.getElementById("table-data").innerHTML = newsHTML;
  console.log(newsHTML);
};

function Main(delay) {
  getData();
  setInterval(() => {
    getData();
  }, delay);
}

Main(20000);

// 가장 뜨거운 코인 top3
const getHotTop = async () => {
  try{
    

  }catch(error){

  }

}

const APIKEY = "f3ca5cbf-842e-439f-829e-45f6a648fca2";

let getGreedIndex = async () => {
  try {
    const url = new URL("https://api.alternative.me/fng/");

    const res = await fetch(url, {
      headers: {
        Accept: "application/json",
        "X-CMC_PRO_API_KEY": APIKEY,
      },
    });
    console.log(res);

    if (!res.ok) {
      const errorMessage = ` ${res.status}: ${res.statusText}`;
      throw new Error(errorMessage);
    }

    const data = await res.json();
  } catch (error) {
    console.error(error);
  }
};

getGreedIndex();
