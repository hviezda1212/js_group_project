const APIKEY = "f3ca5cbf-842e-439f-829e-45f6a648fca2";
let coinList = []; // 코인 정보를 담을 배열

// const inputBox = document.querySelector(".input-box");
const greedChartArea = document.querySelector(".greed-chart-area");
// inputBox.addEventListener("keydown", search);

// async function search(event) {
//     if (event.key === "Enter") {
//         let searchCoin = inputBox.value.toUpperCase();
//         await getlist(searchCoin);
//         render();
//     }
// }

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
        coinList = data.data.filter(
            (e) =>
                e.symbol.includes(keyword) ||
                e.name.toUpperCase().includes(keyword)
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

const render = () => {
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
