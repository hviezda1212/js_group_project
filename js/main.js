// const apiKey = "a0e85cdd-19e4-41c8-8cdf-5447a647ee47";
// const apiKey = "a44490f9-d234-41d8-86da-9a3dcef3ca5d";
//const apiKey="7dde76c0-b878-4056-8bc1-02c3f4846ab3";

const url =
  "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?limit=4000";
const mode = "no-cors";
let coinList = [];
let prevPriceList = {};
let totalResult = 0;
let page = 1;
const pageSize = 100;
const groupSize = 10;
let currentPrice = 0;

const initializePrevPriceList = async () => {
  coinList = [];
  console.log(url);
  const response = await fetch(url, {
    headers: {
      "X-CMC_PRO_API_KEY": apiKey,
      mode: mode,
    },
  });
  const data = await response.json();
  for (i = 0; i < data.data.length; i++) {
    tempCoinSymbol = data.data[i]["symbol"];
    prevPriceList[tempCoinSymbol] = [0];
    //   console.log(prevPriceList)
  }
};
initializePrevPriceList();

const getData = async () => {
  try {
    coinList = [];
    console.log(coinList);
    // console.log(url);
    const response = await fetch(url, {
      headers: {
        "X-CMC_PRO_API_KEY": apiKey,
        mode: mode,
      },
    });
    const data = await response.json();
    //화면에 접속했을때 page =1이 기본값
    //for loop으로 100개씩돌려서 coinList에 push
    //2페이지를 눌렀을땐 page = 2가 되어서 101번째 코인부터 100개가 coinList로 들어간뒤 render()
    if (page === 1) {
      for (i = 0; i < pageSize; i++) {
        coinList.push(data.data[i]);
        // prevPriceList에 코인 가격 정보를 쌓는다
        tempCoinSymbol = coinList[i]["symbol"];
        tempCoinPrice = coinList[i]["quote"].USD["price"];
        prevPriceList[tempCoinSymbol].push(tempCoinPrice);
        // console.log(prevPriceList)
      }
    } else {
      for (i = 0, j = page * 100 - 99; j < pageSize * page + 1; i++, j++) {
        coinList.push(data.data[j]);
        // console.log("ccc",coinList)
        // prevPriceList에 코인 가격 정보를 쌓는다
        tempCoinSymbol = coinList[i]["symbol"];
        tempCoinPrice = coinList[i]["quote"].USD["price"];
        prevPriceList[tempCoinSymbol].push(tempCoinPrice);
        console.log(prevPriceList);
      }
    }
    totalResult = data.data.length;
    // console.log("ttt", coinList.length);
    render();
    paginationRender();
    topCoinRender();
    // console.log("priceis", prevPriceList["BTC"][prevPriceList["BTC"].length-1])
    // console.log("prevpriceis", prevPriceList["BTC"][prevPriceList["BTC"].length-2])
  } catch (error) {
    console.log("error", error);
  }
};

const render = () => {
  let tableHTML = "";
  for (let i = 0; i < coinList.length; i++) {
    const coin = coinList[i];
    const coinSymbol = coin["symbol"];
    const coinPrice = coin["quote"].USD["price"];
    const hourPercentage = coin["quote"].USD["percent_change_1h"];
    const dayPercentage = coin["quote"].USD["percent_change_24h"];
    const weekPercentage = coin["quote"].USD["percent_change_7d"];
    tableHTML += `            
      <tr>
        <td class="priority-1" id="favorite">
          <button class="fav-button" onclick="redirectToWatchList(${i})"> 
            <img
              src="../assets/images/star.png"
              width="20"
              height="19"
              alt=""
              class="star-img"
            />
          </button>
        </td>
        <td id="rank">${page === 1 ? i + 1 : page * 100 - 99 + i}</td>
        <td class = "priority-1 coin-name-col" id="name"><img class="coin-img-size" src='https://s2.coinmarketcap.com/static/img/coins/64x64/${
          coin["id"]
        }.png'></img><span>${coin["name"]}</span></td>
        <td class="priority-1" id="symbol">${coin["symbol"]}</td>
        <td class="priority-1" id="price">${checkPriceChange(
          coinPrice,
          coinSymbol
        )}</td>
        <td class="priority-1" id="1h">${checkPercentageChange(
          hourPercentage
        )}</td>
        <td class="priority-2" id="24h">${checkPercentageChange(
          dayPercentage
        )}</td>
        <td class="priority-2" id="7d">${checkPercentageChange(
          weekPercentage
        )}</td>
        <td class="priority-2" id="market-cap">${
          "$" + Math.floor(coin["quote"].USD["market_cap"]).toLocaleString()
        }</td>
        <td class="priority-2" id="volume">${
          "$" + Math.floor(coin["quote"].USD["volume_24h"]).toLocaleString()
        }</td>
        <td class="priority-2" id="circulating-supply">${
          Math.floor(coin["circulating_supply"]).toLocaleString() +
          " " +
          coin["symbol"]
        }</td>
      </tr>`;
    currentPrice = coin["quote"].USD["price"];
  }
  document.getElementById("table-data").innerHTML = tableHTML;
};

function toggleStar(img) {
  if (img.src.includes("star.png")) {
    img.src = "../assets/images/star-active.png"; // Change to yellow star image path
  } else {
    img.src = "../assets/images/star.png"; // Change to default star image path
  }
}



// 🔎 검색창 기능 시작(주연)
let resultList = [];
let keyword = "";

// 검색창에 입력한 값(키워드) 가져오기
const searchCoins = () => {
    const searchInput = document.getElementById("input-search");
    keyword = searchInput.value.toLowerCase();
    console.log(keyword)

    resultList = findCoinByKeyword(keyword, coinList);
    console.log("resultList: "+resultList)
    resultRender()
}

// 코인 리스트와 키워드 비교
const findCoinByKeyword = (keyword, coinList) => {
    // 키워드를 소문자로 변환하여 대소문자 구분 없이 검색할 수 있도록 함
    const lowerKeyword = keyword.toLowerCase();

    // coinList 배열을 순회하면서 검색
    resultList = coinList.filter(coin => {
        const lowerName = coin.name.toLowerCase();
        const lowerSymbol = coin.symbol.toLowerCase();

        // 이름 또는 심볼 중 하나라도 키워드를 포함하면 true 반환
        return lowerName.includes(lowerKeyword) || lowerSymbol.includes(lowerKeyword);
    });

    return resultList;
}

// 검색결과 화면
const resultRender = () => {
    console.log("result:" + resultList)
    let resultHTML = "";
    // 검색결과가 없는 경우
    if(resultList <= 0){
        resultHTML += `

        `
        document.getElementById("table-data").innerHTML = resultHTML;
        document.getElementById("section-title").innerText = `"${keyword}" 에 대한 검색 결과가 없습니다.`;
    }else{
        for (let i = 0; i < resultList.length; i++) {
            coin = resultList[i];
            coinSymbol = coin["symbol"];
            coinPrice = coin["quote"].USD["price"];
            hourPercentage = coin["quote"].USD["percent_change_1h"];
            dayPercentage = coin["quote"].USD["percent_change_24h"];
            weekPercentage = coin["quote"].USD["percent_change_7d"];
        resultHTML += `
            <tr>
            <td class="priority-1" id="favorite">
            <button class="fav-button" onclick="toggleStar(this.querySelector('img'))"> 
                <img
                src="../assets/images/star.png"
                width="20"
                height="19"
                alt=""
                class="star-img"
                />
            </button>
            </td>
            <td id="rank">${page === 1 ? i + 1 : page * 100 - 99 + i}</td>
            <td class = "priority-1 coin-name-col" id="name"><img class="coin-img-size" src='https://s2.coinmarketcap.com/static/img/coins/64x64/${
            coin["id"]
            }.png'></img><span>${coin["name"]}</span></td>
            <td class="priority-1" id="symbol">${coin["symbol"]}</td>
            <td class="priority-1" id="price">${checkPriceChange(
            coinPrice,
            coinSymbol
            )}</td>
            <td class="priority-1" id="1h">${checkPercentageChange(
            hourPercentage
            )}</td>
            <td class="priority-2" id="24h">${checkPercentageChange(
            dayPercentage
            )}</td>
            <td class="priority-2" id="7d">${checkPercentageChange(
            weekPercentage
            )}</td>
            <td class="priority-2" id="market-cap">${
            "$" + Math.floor(coin["quote"].USD["market_cap"]).toLocaleString()
            }</td>
            <td class="priority-2" id="volume">${
            "$" + Math.floor(coin["quote"].USD["volume_24h"]).toLocaleString()
            }</td>
            <td class="priority-2" id="circulating-supply">${
            Math.floor(coin["circulating_supply"]).toLocaleString() +
            " " +
            coin["symbol"]
            }</td>
        </tr>`; 
        currentPrice = coin["quote"].USD["price"];
        }
    document.getElementById("table-data").innerHTML = resultHTML;
    document.getElementById("section-title").innerText = `"${keyword}" 에 대한 검색 결과`;
    }
    
//document.getElementById("total-container").style.display = "none";
}

const inputSearch = document.getElementById("input-search");

// 모바일 화면인지 체크
const isMoblie = () => {
    return window.innerWidth <= 768;
}

const updatePlaceholder = () => {
    if(isMoblie()){
        inputSearch.placeholder = "무엇을 찾으시나요?";
    }else{
        inputSearch.placeholder = "코인명이나 심볼로 검색해주세요.";
    }
}
updatePlaceholder();

// 모바일 버전 검색창 토글
/*
let searchInputBox = document.getElementById("input-container");

const toggleSearch = () => {
    if(searchInputBox.style.display === "none"){
        searchInputBox.style.display = "flex"
    }else{
        searchInputBox.style.display = "none"
    }   
}*/
// 🔎 검색창 기능 끝(주연)

/*
const resultRender = () => {
    console.log("result:" + resultList)
    const resultHTML = resultList.map(
        (results) =>
        `
        <tr>
            <td id="name">${results.name}</td>
            <td id="name">${results.symbol}</td>
        </tr>
        `
    ).join('');
    document.getElementById("table-data").innerHTML = resultHTML;
}*/

// 검색창 기능 끝(주연)



// const render = () => {
//   let tableHTML = "";
//   for (let i = 0; i < coinList.length; i++) {
//     coinSymbol = coinList[i]["symbol"];
//     coinPrice = coinList[i]["quote"].USD["price"];
//     tableHTML += `
//         <tr>
//             <td id="favorite"><button class="fav-button"><i class="fa-regular fa-star"></i></button></td>
//             <td id="rank">${page === 1 ? i + 1 : page * 100 - 99 + i}</td>
//             <td id="name"><img class="coin-img-size" src='https://s2.coinmarketcap.com/static/img/coins/64x64/${coinList[i]["id"]}.png'></img><span>${coinList[i]["name"]}</span></td>
//             <td id="symbol">${coinList[i]["symbol"]}</td>
//             <td id="price">${checkPriceChange(coinPrice, coinSymbol)}</td>
//             <td id="1h">${coinList[i]["quote"].USD["percent_change_1h"].toFixed(2) + "%"}</td>
//             <td id="24h">${coinList[i]["quote"].USD["percent_change_24h"].toFixed(2) + "%"}</td>
//             <td id="7d">${coinList[i]["quote"].USD["percent_change_7d"].toFixed(2) + "%"}</td>
//             <td id="market-cap">${"$" + Math.floor(coinList[i]["quote"].USD["market_cap"]).toLocaleString()}</td>
//             <td id="volume">${"$" + Math.floor(coinList[i]["quote"].USD["volume_24h"]).toLocaleString()}</td>
//             <td id="circulating-supply">${Math.floor(coinList[i]["circulating_supply"]).toLocaleString() + " " + coinList[i]["symbol"]}</td>
//         </tr>`;
//     currentPrice = coinList[i]["quote"].USD["price"];
//   }
//   document.getElementById("table-data").innerHTML = tableHTML;
// };

// const render = () => {
//   let tableHTML = "";
//   for (i = 0; i < coinList.length; i++) {
//     coinSymbol = coinList[i]["symbol"];
//     coinPrice = coinList[i]["quote"].USD["price"];
//     tableHTML += `            <tr>
//         <td id = "favorite"><button class = "fav-button"><i class="fa-regular fa-star"></i></button></td>
//         <td id = "rank">${page === 1 ? i + 1 : page * 100 - 99 + i}</td>
//         <td id = "name"><img class = "coin-img-size" src ='https://s2.coinmarketcap.com/static/img/coins/64x64/${
//           coinList[i]["id"]
//         }.png'></img><span>${coinList[i]["name"]}</span></td>
//         <td id = "symbol">${coinList[i]["symbol"]}</td>
//         <td id = "price">${checkPriceChange(coinPrice, coinSymbol)}</td>
//         <td id = "1h">${
//           coinList[i]["quote"].USD["percent_change_1h"].toFixed(2) + "%"
//         }</td>
//         <td id = "24h">${
//           coinList[i]["quote"].USD["percent_change_24h"].toFixed(2) + "%"
//         }</td>
//         <td id = "7d">${
//           coinList[i]["quote"].USD["percent_change_7d"].toFixed(2) + "%"
//         }</td>
//         <td id = "market-cap">${
//           "$" +
//           Math.floor(coinList[i]["quote"].USD["market_cap"]).toLocaleString()
//         }</td>
//         <td id = "volume">${
//           "$" +
//           Math.floor(coinList[i]["quote"].USD["volume_24h"]).toLocaleString()
//         }</td>
//         <td id = "circulating-supply">${
//           Math.floor(coinList[i]["circulating_supply"]).toLocaleString() +
//           " " +
//           coinList[i]["symbol"]
//         }</td>
//     </tr>`;
//     currentPrice = coinList[i]["quote"].USD["price"];
//   }
//   document.getElementById("table-data").innerHTML = tableHTML;
//   // console.log(tableHTML);
// };

function redirectToWatchList(index) {
  const clickedCoin = coinList[index];
  let clickedCoins = JSON.parse(localStorage.getItem("clickedCoins")) || [];
  clickedCoins.push(clickedCoin);
  localStorage.setItem("clickedCoins", JSON.stringify(clickedCoins));
  console.log("clickedCoins", clickedCoins);
  // window.location.href = "watchList.html";
}

const checkPriceChange = (price, symbol) => {
  if (price > prevPriceList[symbol][prevPriceList[symbol].length - 2]) {
    // document.getElementById("price").className = "higher"
    return `<span style = "color:green">${
      "$" +
      price.toLocaleString("en-US", {
        maximumFractionDigits: 2,
      })
    }</span>`;
    //초록색
  } else if (price < prevPriceList[symbol][prevPriceList[symbol].length - 2]) {
    // document.getElementById("price").className = "lower"
    return `<span style = "color:red">${
      "$" +
      price.toLocaleString("en-US", {
        maximumFractionDigits: 2,
      })
    }</span>`;
    //빨간색
  } else {
    // document.getElementById("price").className = "same"
    return `<span style = "color:black">${
      "$" +
      price.toLocaleString("en-US", {
        maximumFractionDigits: 2,
      })
    }</span>`;
    //검은색
  }
  // prevPriceList의 가격정보를 불러와 가격을 비교한다
  // -1인덱스가격 (최신가격)이 -2인덱스가격 (전가격)보다 높으면 초록색, 낮으면 빨간색, 같으면 검은색으로 표시한다
};

const checkPercentageChange = (percentage) => {
  if (percentage > 0) {
    //초록색
    return `<span style = "color:green">${percentage.toFixed(2) + "%"}</span>`;
  } else if (percentage < 0) {
    //빨간색
    return `<span style = "color:red">${percentage.toFixed(2) + "%"}</span>`;
  } else {
    //검은색
    return `<span style = "color:black">${percentage.toFixed(2) + "%"}</span>`;
  }
};

const paginationRender = () => {
  //total result
  //page
  //pgsize
  //groupsize
  //totalPages
  const totalPages = Math.ceil(totalResult / pageSize);
  //pagegroup
  const pageGroup = Math.ceil(page / groupSize);
  // console.log("pagegroup", pageGroup)
  //lastpage
  let lastPage = pageGroup * groupSize;
  if (lastPage > totalPages) {
    lastPage = totalPages;
  }
  // console.log("last", lastPage);
  //firstpage
  const firstPage =
    lastPage - (groupSize - 1) <= 0 ? 1 : lastPage - (groupSize - 1);
  // console.log("firstpage", firstPage)
  let paginationHTML = "";
  if (page === 1) {
    //1페이지면 <<와 Previous를 그리지 않는다
    ("");
  } else {
    paginationHTML += `<a class="page-link" onclick="moveToPage(${1})" aria-label="Previous">
    <i class="fa-solid fa-angles-left"></i>
  </a>`;
    paginationHTML += `<li class="page-item" onclick="moveToPage(${
      page - 1
    })"><a class="page-link"><i class="fa-solid fa-angle-left"></i></a></li>`;
  }
  ///페이지 그룹을 그린다
  for (let i = firstPage; i <= lastPage; i++) {
    paginationHTML += `<li class="page-item ${
      i === page ? "active" : ""
    }"onclick="moveToPage(${i})"><a class="page-link">${i}</a></li>`;
  }
  //제일 마지막 페이지에 있으면 >>와 next를 그리지 않는다
  if (page === totalPages) {
    ("");
  } else {
    paginationHTML += `<li class="page-item" onclick="moveToPage(${
      page + 1
    })"><a class="page-link"><i class="fa-solid fa-angle-right"></i></a></li>`;
    paginationHTML += `<a class="page-link page-item" onclick="moveToPage(${
      totalPages - 1
    })" aria-label="Next">
    <i class="fa-solid fa-angles-right"></i>
    </a>`;
  }
  document.querySelector(".pagination").innerHTML = paginationHTML;
};

const moveToPage = (pageNum) => {
  page = pageNum;
  getData();
};

function Main(delay) {
  getData();
  setInterval(() => {
    getData();
  }, delay);
}
//20초마다 코인 정보를 업데이트한다
Main(30000);

// 가장 뜨거운 코인, 가장 차가운 코인 top3
const topCoinRender = () => {
  // hot top3
  let hotTempList = coinList;
  const hotList = hotTempList
    .sort(
      (a, b) => b.quote.USD.percent_change_24h - a.quote.USD.percent_change_24h
    )
    .slice(0, 3);
  console.log("hotList: " + hotList);
  let hotHTML = "";

  for (i = 0; i < hotList.length; i++) {
    hotHTML += `
      <div class="hot-list list">
        <div class="coin-left">
          <div class="coin-rank">${hotList.indexOf(hotList[i]) + 1}</div>
          <div class="coin-names">
            <div class="coin-name">
              <img class="coin-img-size"
              src='https://s2.coinmarketcap.com/static/img/coins/64x64/${
                hotList[i]["id"]
              }.png'>
              </img>
              <span>${hotList[i]["name"]}</span>
            </div>
            <div class="coin-symbol">${hotList[i]["symbol"]}</div>
          </div>
        </div>
        <div class="coin-24h">${
          hotList[i]["quote"].USD["percent_change_24h"].toFixed(2) + "%"
        }</div>
      </div>
    `;
  }
  document.getElementById("hotChart").innerHTML = hotHTML;

  // cold top3
  // const coldList = coinList
  let coldTempList = coinList;
  const coldList = coldTempList
    .sort(
      (a, b) => a.quote.USD.percent_change_24h - b.quote.USD.percent_change_24h
    )
    .slice(0, 3);
  console.log("coldList: " + coldList);
  let coldHTML = "";

  for (i = 0; i < coldList.length; i++) {
    coldHTML += `
      <div class="hot-list list">
        <div class="coin-left">
          <div class="coin-rank">${coldList.indexOf(coldList[i]) + 1}</div>
          <div class="coin-names">
            <div class="coin-name">
              <img class="coin-img-size"
              src='https://s2.coinmarketcap.com/static/img/coins/64x64/${
                coldList[i]["id"]
              }.png'>
              </img>
              <span>${coldList[i]["name"]}</span>
            </div>
            <div class="coin-symbol">${coldList[i]["symbol"]}</div>
          </div>
        </div>
        <div class="coin-24h">${
          coldList[i]["quote"].USD["percent_change_24h"].toFixed(2) + "%"
        }</div>
      </div>
    `;
  }
  document.getElementById("coldChart").innerHTML = coldHTML;
};

/*
//const APIKEY = "f3ca5cbf-842e-439f-829e-45f6a648fca2";
let coinListItems = []; // 코인 정보를 담을 배열

const inputBox = document.querySelector(".input-box");
const greedChartArea = document.querySelector(".greed-chart-area");
inputBox.addEventListener("keydown", search);

async function search(event) {
  if (event.key === "Enter") {
    let searchCoin = inputBox.value.toUpperCase();
    await getlist(searchCoin);
    rendering();
  }
}

const getlist = async (keyword) => {
  try {
    const url = new URL(
      `https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?limit=5000&convert=KRW`
    );

    const res = await fetch(url, {
      headers: {
        "X-CMC_PRO_API_KEY": apiKey,
      },
    });
    const data = await res.json();
    coinListItems = data.data.filter(
      (e) =>
        e.symbol.includes(keyword) || e.name.toUpperCase().includes(keyword)
    );
  } catch (error) {
    console.error("error message", error);
  }
};

// (async () => {
//     await getlist("BT");
//     console.log(coinList.map((e) => e.symbol));
// })();
*/
const fearGreed = async () => {
  let endTime = Math.floor(Date.now() / 1000);
  let startTime = endTime - 604800;

  const url = `https://api.coinmarketcap.com/data-api/v3/fear-greed/chart?start=${startTime}&end=${endTime}`;
  // console.log(url);
  const res = await fetch(url);
  const data = await res.json();
  console.log("data: ", data);

  return data.data.dataList;
};
/*
const fearGreedRender = async () => {
  let dataList = await fearGreed();
  let last = dataList[dataList.length - 1];
  let indicator = document.querySelector(".indicator");
  indicator.style.transform = `rotate(${(180 * last.score) / 100}deg)`;
  indicator.style.display = "block";

  let feargreedNum = document.querySelector(".feargreed-num");
  feargreedNum.innerText = Math.floor(last.score);
  console.log("feargreedNum.innerText: ", feargreedNum.innerText);
};
fearGreedRender();

const rendering = () => {
  let resultHTML = `<thead>
    <tr>
        <th>#</th>
        <th>Name</th>
        <th>Symbol</th>
        <th>Price</th>
        <th>1h %</th>
        <th>24h %</th>
        <th>7dh %</th>
        <th>Market Cap</th>
        <th>Volume(24h)</th>
        <th>Circulating Supply</th>
    </tr>
</thead>`;

  // coinList 배열을 순회하면서 각 코인 정보를 테이블에 추가
  coinListItems.forEach((coin, index) => {
    resultHTML += `
        <tr>

            <td>${index + 1}</td>
            <td>${coin.name}</td>
            <td>${coin.symbol}</td>
            <td>${coin.quote.KRW.price}</td>
            <td>${coin.quote.KRW.percent_change_1h}</td>
            <td>${coin.quote.KRW.percent_change_24h}</td>
            <td>${coin.quote.KRW.percent_change_7d}</td>
            <td>${coin.quote.KRW.market_cap}</td>
            <td>${coin.quote.KRW.volume_24h}</td>
            <td></td>
            </tr>`;
  });

  resultHTML += `</tbody>`;

  // HTML에 결과 테이블을 추가
  document.querySelector("#table-data").innerHTML = resultHTML;
};
getlist();
*/

//region NEWS
let news_List = [];
let articles = [];
let news_page = 1;
const NEWS_PAGE_SIZE = 3;

let news_url = new URL(`https://noonanewsapi.netlify.app/top-headlines?`);

const getNews = async () => {
  try {
    news_url.searchParams.set("page", news_page);
    console.log("error", news_page);
    const response = await fetch(news_url);
    const data = await response.json();
    if (response.status === 200) {
      if (data.articles.length == 0) {
        news_page = 0;
        throw new Error("No result for this search");
      }
      news_List = data.articles;
      news_totalPage = 3;
      news_render();
    } else {
      news_page = 0;
      throw new Error(data.message);
    }
  } catch (error) {
    console.log("error", error.message);
    news_page = 0;
    errorRender(error.message);
  }
};

const getLatestNews = async () => {
  news_url = new URL(
    `https://noonanewsapi.netlify.app/top-headlines?q=코인&page=1&pageSize=${NEWS_PAGE_SIZE}`
  );
  getNews();
};

const news_render = () => {
  let newsHTML = ``;
  for (let i = 0; i <= NEWS_PAGE_SIZE - 1; i++) {
    newsHTML += `<div class="news news_slide-content">
      <div class="img-area">
        <img class="news-img" src=${news_List[i].urlToImage} />
      </div>
      <div class="text-area">
        <div class="news-title">${
          news_List[i].title == null || news_List[i].title == ""
            ? "내용없음"
            : news_List[i].title.length > 33
            ? news_List[i].title.substring(0, 33)
            : news_List[i].title
        }</div>
        <p>${
          news_List[i].description == null || news_List[i].description == ""
            ? "내용없음"
            : news_List[i].description.length > 40
            ? news_List[i].description.substring(0, 40) + "..."
            : news_List[i].description
        }</p>
        <div class="news-date">${
          news_List[i].publishedAt == null || news_List[i].publishedAt == ""
            ? "내용없음"
            : news_List[i].publishedAt.length > 10
            ? news_List[i].publishedAt.substring(0, 10)
            : news_List[i].publishedAt
        }</div>
      </div>
    </div>`;
  }

  document.getElementById("news-board").innerHTML = newsHTML;
};

const errorRender = (errorMessage) => {
  const errorHTML = `<div class="alert alert-danger" role = "alert">
    ${errorMessage}
  </div>`;

  document.getElementById("news-board").innerHTML = errorHTML;
};

getLatestNews();

//regionend NEWS

//region SCROLL

// 스크롤 최상단으로 이동하는 애니메이션
document.getElementById("scrollToTop").addEventListener("click", function () {
  window.scroll({
    top: 0,
    left: 0,
    behavior: "smooth",
  });
});

// 스크롤 위치에 따라 스크롤 최상단 버튼 표시/숨김
window.onscroll = function () {
  var scrollButton = document.getElementById("scrollToTop");
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    scrollButton.style.display = "flex";
  } else {
    scrollButton.style.display = "none";
  }
};

//regionend SCROLL
//로고 이미지시 해당 메인페이지로 이동
let logoClick = document.querySelector(".logo-img");
logoClick.addEventListener("click", () => {
  window.location.href = "../html/main.html";
});

//즐겨찾기 마우스 hover했을 때, 노란색 이미지로 변경
//즐겨찾기 마우스 out 할 때, 본 이미지로 변경
const starImg = document.querySelector(".star-img");

starImg.addEventListener("mouseover", toggleStarImage);
starImg.addEventListener("mouseout", toggleStarImage);

function toggleStarImage() {
  const imageName = this.src.includes("star-active.png")
    ? "star.png"
    : "star-active.png";
  this.src = `../assets/images/${imageName}`;
}

//region DARK
let darkToggle = document.querySelector("#dark-toggle");
let switchImg = document.querySelector("#dark-toggle img");
let logoImg = document.querySelector(".logo-img");
let footerImg = document.querySelector(".footer-img");
let body = document.querySelector("body");
let watchListBtn = document.querySelector("#watch-list-btn");

darkToggle.addEventListener(
  "click",
  () => {
    if (body.classList.contains("dark-mode")) {
      document.body.classList.remove("dark-mode");
      switchImg.src = "../assets/images/moon.png";
      watchListBtn.style.color = "black";
      logoImg.src = "../assets/images/logo.svg";
      footerImg.src = "../assets/images/logo.svg";
    } else {
      body.classList.add("dark-mode");
      switchImg.src = "../assets/images/sun.png";
      logoImg.src = "../assets/images/logo-dark.svg";
      footerImg.src = "../assets/images/logo-dark.svg";
      watchListBtn.style.color = "white";
    }
  },
  false
);

//dark 모드시 로고

//dark 토글 클릭

let searchIcon = document.querySelector(".search-icon");

darkToggle.addEventListener("click", () => {
  searchIcon.style.color = "black";
});
//regionend DARK

//region TOGGLE
const toggleList = document.querySelectorAll(".toggleSwitch");

toggleList.forEach(($toggle) => {
  $toggle.onclick = () => {
    $toggle.classList.toggle("active");
  };
});

document.querySelector(".toggleSwitch").addEventListener(
  "click",
  function () {
    if (document.querySelector(".highlights").classList.contains("active")) {
      document.querySelector(".highlights").classList.remove("active");
    } else {
      document.querySelector(".highlights").classList.add("active");
    }
  },
  false
);
//regionend TOGGLE

//슬라이드 기능
const swiper = document.querySelector(".slide-wrapper");
const bullets = document.querySelectorAll(".slide-dot");

let currentSlide = 0;

const showSlide = (slideIndex) => {
  const slideWidth = document.querySelector(".slide-content").offsetWidth;
  swiper.style.transform = `translateX(-${slideIndex * slideWidth}px)`;
  currentSlide = slideIndex;

  bullets.forEach((bullet, index) => {
    if (index === currentSlide) {
      bullet.classList.add("active");
    } else {
      bullet.classList.remove("active");
    }
  });
};

bullets.forEach((bullet, index) => {
  bullet.addEventListener("click", () => {
    showSlide(index);
  });
});

// // 오토 슬라이드
const intervalDuration = 5000;

// // 슬라이드 변경 함수
const autoSlide = () => {
  const nextSlide = (currentSlide + 1) % bullets.length;
  showSlide(nextSlide);
};

// // 자동 슬라이드 설정(
const autoSlideInterval = setInterval(autoSlide, intervalDuration);

showSlide(0);

//뉴스 슬라이드 기능
const news_swiper = document.querySelector(".news_slide-wrapper");
const news_bullets = document.querySelectorAll(".news_slide-dot");

let news_currentSlide = 0;

const news_showSlide = (slideIndex) => {
  const news_slideWidth = document.querySelector(
    ".news_slide-content"
  ).offsetWidth;
  news_swiper.style.transform = `translateX(-${
    slideIndex * news_slideWidth
  }px)`;
  news_currentSlide = slideIndex;

  news_bullets.forEach((bullet, index) => {
    if (index === news_currentSlide) {
      bullet.classList.add("active");
    } else {
      bullet.classList.remove("active");
    }
  });
};

news_bullets.forEach((bullet, index) => {
  bullet.addEventListener("click", () => {
    news_showSlide(index);
  });
});

// // 슬라이드 변경 함수
const news_autoSlide = () => {
  const news_nextSlide = (news_currentSlide + 1) % news_bullets.length;
  news_showSlide(news_nextSlide);
};

// // 자동 슬라이드 설정(
const news_autoSlideInterval = setInterval(news_autoSlide, intervalDuration);

news_showSlide(0);

//모바일버전에서 메뉴 버튼 클릭시 메뉴 리스트

//x버튼 클릭시 메뉴창 사라지고 원래 이미지 노출

// let listItems = document.querySelector(".mobile-container");
// let header = document.querySelector("header");

// function toggleMenu() {
//   listItems.style.display === "none"
//     ? ((listItems.style.display = "block"), (header.style.display = "none"))
//     : (listItems.style.display = "none");
// }

// let closeBtn = document.querySelector(".close-btn");
// closeBtn.addEventListener("click", () => {
//   listItems.style.display = "none";
//   header.style.display = "block";
// });
