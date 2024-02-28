// const apiKey = "ce14db1d-0bc9-43ee-b1ba-b5200094351f";
const url =
  "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?limit=5000";
const mode = "no-cors";
let coinList = []
let totalResult = 0;
let page = 1;
const pageSize = 100;
const groupSize = 5;

const getData = async () => {
  try {
    coinList = []
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
    if(page === 1){
      for(i=0; i<pageSize; i++){
        coinList.push(data.data[i])
      }
    }else{
      for(i=page*100-99; i<pageSize*page+1; i++){
        coinList.push(data.data[i])
      }
    }
    totalResult = data.data.length;
    console.log("ttt",coinList.length);
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
        <td id = "rank">${page===1?i+1:page*100-99+i}</td>
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

const paginationRender=()=>{
  //total result
  //page
  //pgsize
  //groupsize
  //totalPages
  const totalPages = Math.ceil(totalResult/pageSize)
  //pagegroup
  const pageGroup = Math.ceil(page/groupSize)
  //lastpage
  let lastPage = pageGroup*groupSize
  if(lastPage>totalPages){
      lastPage=totalPages;
  }
  console.log("last",totalPages)
  //firstpage
  const firstPage = lastPage - (groupSize -1)<=0?1: lastPage -(groupSize-1);
  let paginationHTML = ""
  if(page===firstPage){
      ""
  }else{
      paginationHTML += `<a class="page-link" onclick="moveToPage(${firstPage})" aria-label="Previous">
      <span aria-hidden="true">&laquo;</span>
  </a>`
  paginationHTML += `<li class="page-item" onclick="moveToPage(${page-1})"><a class="page-link">Previous</a></li>`
  };
  for(let i=firstPage; i<lastPage;i++){
      paginationHTML+=`<li class="page-item ${i===page?"active":""}"onclick="moveToPage(${i})"><a class="page-link">${i}</a></li>`
  }
  if(page===lastPage){
      ""
  }else{
      paginationHTML+=`<li class="page-item" onclick="moveToPage(${page+1})"><a class="page-link">Next</a></li>`
      paginationHTML+=`<a class="page-link" onclick="moveToPage(${totalPages})" aria-label="Next">
      <span aria-hidden="true">&raquo;</span>
    </a>`
  }
  document.querySelector(".pagination").innerHTML=paginationHTML
}

const moveToPage=(pageNum)=>{
  getData()
  page = pageNum;
}

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
