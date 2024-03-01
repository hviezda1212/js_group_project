// const apiKey = "b1b9c007-5f07-4d7c-b26f-948e542b8144";
// const apiKey = "a44490f9-d234-41d8-86da-9a3dcef3ca5d";
const url =
  "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?limit=5000";
const mode = "no-cors";
let coinList = [];
let prevPriceList = {};
let totalResult = 0;
let page = 1;
const pageSize = 100;
const groupSize = 5;
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
      }
    } else {
      for (i = page * 100 - 99; i < pageSize * page + 1; i++) {
        coinList.push(data.data[i]);
        // prevPriceList에 코인 가격 정보를 쌓는다
        tempCoinSymbol = coinList[i]["symbol"];
        tempCoinPrice = coinList[i]["quote"].USD["price"];
        prevPriceList[tempCoinSymbol].push(tempCoinPrice);
      }
    }
    totalResult = data.data.length;
    // console.log("ttt", coinList.length);
    render();
    paginationRender();
    // console.log("priceis", prevPriceList["BTC"][prevPriceList["BTC"].length-1])
    // console.log("prevpriceis", prevPriceList["BTC"][prevPriceList["BTC"].length-2])
  } catch (error) {
    console.log("error", error);
  }
};

const render = () => {
  let tableHTML = "";
  for (i = 0; i < coinList.length; i++) {
    coinSymbol = coinList[i]["symbol"];
    coinPrice = coinList[i]["quote"].USD["price"];
    tableHTML += `            <tr>
        <td id = "favorite"><button class = "fav-button"><i class="fa-regular fa-star"></i></button></td>
        <td id = "rank">${page === 1 ? i + 1 : page * 100 - 99 + i}</td>
        <td id = "name"><img class = "coin-img-size" src ='https://s2.coinmarketcap.com/static/img/coins/64x64/${
          coinList[i]["id"]
        }.png'></img><span>${coinList[i]["name"]}</span></td>
        <td id = "symbol">${coinList[i]["symbol"]}</td>
        <td id = "price">${checkPriceChange(coinPrice, coinSymbol)}</td>
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
    currentPrice = coinList[i]["quote"].USD["price"];
  }
  document.getElementById("table-data").innerHTML = tableHTML;
  // console.log(tableHTML);
};

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

const paginationRender = () => {
  //total result
  //page
  //pgsize
  //groupsize
  //totalPages
  const totalPages = Math.ceil(totalResult / pageSize);
  //pagegroup
  const pageGroup = Math.ceil(page / groupSize);
  //lastpage
  let lastPage = pageGroup * groupSize;
  if (lastPage > totalPages) {
    lastPage = totalPages;
  }
  console.log("last", totalPages);
  //firstpage
  const firstPage =
    lastPage - (groupSize - 1) <= 0 ? 1 : lastPage - (groupSize - 1);
  let paginationHTML = "";
  if (page === firstPage) {
    ("");
  } else {
    paginationHTML += `<a class="page-link" onclick="moveToPage(${firstPage})" aria-label="Previous">
      <span aria-hidden="true">&laquo;</span>
  </a>`;
    paginationHTML += `<li class="page-item" onclick="moveToPage(${
      page - 1
    })"><a class="page-link">Previous</a></li>`;
  }
  for (let i = firstPage; i < lastPage; i++) {
    paginationHTML += `<li class="page-item ${
      i === page ? "active" : ""
    }"onclick="moveToPage(${i})"><a class="page-link">${i}</a></li>`;
  }
  if (page === lastPage) {
    ("");
  } else {
    paginationHTML += `<li class="page-item" onclick="moveToPage(${
      page + 1
    })"><a class="page-link">Next</a></li>`;
    paginationHTML += `<a class="page-link" onclick="moveToPage(${totalPages})" aria-label="Next">
      <span aria-hidden="true">&raquo;</span>
    </a>`;
  }
  document.querySelector(".pagination").innerHTML = paginationHTML;
};

const moveToPage = (pageNum) => {
  getData();
  page = pageNum;
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
  const hotList = coinList.slice(0, 3);
  console.log("hotList: " + hotList);
  let hotHTML = "";

  for (i = 0; i < hotList.length; i++) {
    hotHTML += `<div class="hot-list list">
      <div class="coin-left">
        <div class="coin-rank">${hotList.indexOf(hotList[i]) + 1}</div>
        <div class="coin-names">
          <div class="coin-name">${hotList[i]["name"]}</div>
          <div class="coin-symbol">${hotList[i]["symbol"]}</div>
        </div>
      </div>
      <div class="coin-24h">${
        hotList[i]["quote"].USD["percent_change_24h"].toFixed(2) + "%"
      }</div>
    </div>`;
  }
  document.getElementById("hot-container").innerHTML = hotHTML;

  // cold top3
  const coldList = coinList.slice(-3);
  console.log("coldList: " + coldList);
  let coldHTML = "";

  for (i = 0; i < coldList.length; i++) {
    coldHTML += `<div class="hot-list list">
      <div class="coin-left">
        <div class="coin-rank">${coldList.indexOf(coldList[i]) + 1}</div>
        <div class="coin-names">
          <div class="coin-name">${coldList[i]["name"]}</div>
          <div class="coin-symbol">${coldList[i]["symbol"]}</div>
        </div>
      </div>
      <div class="coin-24h">${
        coldList[i]["quote"].USD["percent_change_24h"].toFixed(2) + "%"
      }</div>
    </div>`;
  }
  document.getElementById("cold-container").innerHTML = coldHTML;
};

const APIKEY = "f3ca5cbf-842e-439f-829e-45f6a648fca2";
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
        "X-CMC_PRO_API_KEY": APIKEY,
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

//region NEWS
let news_List = [];
let articles = [];
let news_page = 1;
let news_totalPage = 1;
let news_totalResult = 0;
const NEWS_PAGE_SIZE = 1;
const news_groupSize = 3;

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
        news_totalPage = 0;
        news_paginationRender();
        throw new Error("No result for this search");
      }
      news_List = data.articles;
      news_totalPage = 3;
      news_totalResult = data.totalResults;
      news_render();
      news_paginationRender();
    } else {
      news_page = 0;
      news_totalPage = 0;
      news_paginationRender();
      throw new Error(data.message);
    }
  } catch (error) {
    console.log("error", error.message);
    news_page = 0;
    news_totalPage = 0;
    news_paginationRender();
    errorRender(error.message);
  }
};

const getLatestNews = async () => {
  news_url = new URL(
    `https://noonanewsapi.netlify.app/top-headlines?q=코인&page=1&pageSize=1`
  );
  getNews();
};

const news_render = () => {
  const newsHTML = news_List
    .map(
      (news) => `        <div class="news">
  <div class="img-area">
    <img class="news-img" src=${news.urlToImage} />
  </div>
  <div class="text-area">
    <div class="news-title">${
      news.title == null || news.title == ""
        ? "내용없음"
        : news.title.length > 33
        ? news.title.substring(0, 33)
        : news.title
    }</div>
    <p>${
      news.description == null || news.description == ""
        ? "내용없음"
        : news.description.length > 40
        ? news.description.substring(0, 40) + "..."
        : news.description
    }</p>
    <div>${news.source.name}${news.publishedAt}</div>
  </div>
</div>`
    )
    .join("");

  document.getElementById("news-board").innerHTML = newsHTML;
};

const errorRender = (errorMessage) => {
  const errorHTML = `<div class="alert alert-danger" role = "alert">
    ${errorMessage}
  </div>`;

  document.getElementById("news-board").innerHTML = errorHTML;
};

const news_paginationRender = () => {
  let news_paginationHTML = ``;
  let news_pageGroup = Math.ceil(news_page / news_groupSize);
  let news_lastPage = news_pageGroup * news_groupSize;

  if (news_lastPage > news_totalPage) {
    news_lastPage = news_totalPage;
  }
  let news_firstPage =
    news_lastPage - (news_groupSize - 1) <= 0
      ? 1
      : news_lastPage - (news_groupSize - 1);
  for (let i = news_firstPage; i <= news_lastPage; i++) {
    news_paginationHTML += `<li class="page-item">
                        <input class="page-link" type="radio" onclick="news_moveToPage(${i})" ${
      i == news_page ? "checked" : ""
    } ></input>
                       </li>`;
  }

  document.querySelector(".news-pagination").innerHTML = news_paginationHTML;
};

const news_moveToPage = (pageNum) => {
  news_page = pageNum;
  window.scrollTo({ top: 0, behavior: "smooth" });
  getNews();
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

//region DARK
let darkToggle = document.querySelector("#dark-toggle");
let switchImg = document.querySelector("#dark-toggle img");
let logoImg = document.querySelector(".logo img");
let body = document.querySelector("body");
let watchListBtn = document.querySelector(".watch-list-btn");

darkToggle.addEventListener(
  "click",
  () => {
    if (body.classList.contains("dark-mode")) {
      document.body.classList.remove("dark-mode");
      switchImg.src = "../assets/images/moon.png";
      logoImg.src = "../assets/images/logo.svg";
    } else {
      body.classList.add("dark-mode");
      switchImg.src = "../assets/images/sun.png";
      logoImg.src = "../assets/images/logo-dark.svg";
      watchListBtn.style.backgroundColor = "#0d1421";
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

// 슬라이드 기능
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
