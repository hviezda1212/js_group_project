const APIKEY = "f3ca5cbf-842e-439f-829e-45f6a648fca2";
let coinList = []; // 코인 정보를 담을 배열

// inputBox.addEventListener("keydown", search);

// async function search(event) {
//     if (event.key === "Enter") {
//         let searchCoin = inputBox.value.toUpperCase();
//         await getlist(searchCoin);
//     }
// }

const getlist = async () => {
    try {
        const url = new URL(
            `https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest`
        );

        const res = await fetch(url, {
            headers: {
                "X-CMC_PRO_API_KEY": APIKEY,
            },
        });
        const data = await res.json();
        return data;
    } catch (error) {
        console.error("error message", error);
    }
};

getlist();

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
