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
        console.error(rror);
    }
};

getGreedIndex();
