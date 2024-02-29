//const apiKey = "ce14db1d-0bc9-43ee-b1ba-b5200094351f";
const url =
  "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?limit=5000";
const mode = "no-cors";
let coinList = [];
let totalResult = 0;
let page = 1;
const pageSize = 100;
const groupSize = 5;

const getData = async () => {
  try {
    coinList = [];
    console.log(url);
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
      }
    } else {
      for (i = page * 100 - 99; i < pageSize * page + 1; i++) {
        coinList.push(data.data[i]);
      }
    }
    totalResult = data.data.length;
    console.log("ttt", coinList.length);
    render();
    paginationRender();
  } catch (error) {
    console.log("error", error);
  }
};

const render = () => {
  let newsHTML = "";
  for (i = 0; i < coinList.length; i++) {
    newsHTML += `            <tr>
        <td id = "favorite"><button class = "fav-button"><i class="fa-regular fa-star"></i></button></td>
        <td id = "rank">${page === 1 ? i + 1 : page * 100 - 99 + i}</td>
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
Main(20000);

// 가장 뜨거운 코인 top3
const getHotTop = async () => {
  try {
  } catch (error) {}
};

const APIKEY = "f3ca5cbf-842e-439f-829e-45f6a648fca2";
let fearcoinList = []; // 코인 정보를 담을 배열

const inputBox = document.querySelector(".input-box");
const greedChartArea = document.querySelector(".greed-chart-area");
inputBox.addEventListener("keydown", search);

async function search(event) {
  if (event.key === "Enter") {
    let searchCoin = inputBox.value.toUpperCase();
    await getlist(searchCoin);
    render();
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
    fearcoinList = data.data.filter(
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
  // console.log(data.data.dataList);
};
fearGreed();

const fearGreedRender = () => {
  let greedHTML = ` <div class="area-title greed-title">
    <img
        src="../assets/images/feargreed.svg"
        alt="공포탐욕지수"
    />
</div>`;
};

const fearrender = () => {
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
  coinList.forEach((coin, index) => {
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
document.getElementById('dark-toggle').addEventListener("click", function() {
  if(document.querySelector('body').classList.contains('dark-mode')){
      document.body.classList.remove("dark-mode");
  }else{
      document.body.classList.add("dark-mode");
  }
},false);

//regionend DARK

//region TOGGLE
const toggleList = document.querySelectorAll(".toggleSwitch");

toggleList.forEach(($toggle) => {
  $toggle.onclick = () => {
    $toggle.classList.toggle('active');
  }
});

document.querySelector(".toggleSwitch").addEventListener("click", function() {
  if(document.querySelector('.highlights').classList.contains("active")){
      document.querySelector('.highlights').classList.remove("active");
  }else{
      document.querySelector('.highlights').classList.add("active");
  }
},false);
//regionend TOGGLE