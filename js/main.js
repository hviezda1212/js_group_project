let inputBox = document.querySelector(".input-box");
let coinList = []; // 코인 정보를 담을 배열

inputBox.addEventListener("keydown", search);

async function search(event) {
    if (event.key === "Enter") {
        let searchCoin = inputBox.value.toUpperCase();
        await getlist(searchCoin);
    }
}

const getlist = async (searchCoin) => {
    try {
        const url = new URL("https://api.bithumb.com/public/ticker/ALL_btc");

        const res = await fetch(url);
        const data = await res.json();

        const coinData = data.data[searchCoin];

        if (coinData) {
            let minPrice = coinData.min_price;
            let unitsTraded24H = coinData.units_traded_24H;

            // 코인 정보를 객체로 만들어서 배열에 추가
            let coinInfo = {
                searchCoin: searchCoin,
                minPrice: minPrice,
                unitsTraded24H: unitsTraded24H,
            };

            coinList = [coinInfo];

            render();
        } else {
            console.log(`Data not found for ${searchCoin}`);
        }
    } catch (error) {
        console.error("error message", error);
    }
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
            <td>${coin.searchCoin}</td>
            <td></td>
            <td>${coin.minPrice}</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td>${coin.unitsTraded24H}</td>
            <td></td>
            </tr>`;
    });

    resultHTML += `</tbody>`;

    // HTML에 결과 테이블을 추가
    document.querySelector("#table-data").innerHTML = resultHTML;
};
