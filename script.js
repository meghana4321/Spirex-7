
const amountInput = document.getElementById("amount");
const fromCurrency = document.getElementById("fromCurrency");
const toCurrency = document.getElementById("toCurrency");
const convertBtn = document.getElementById("convertBtn");
const swapBtn = document.getElementById("swap");

async function convertCurrency() {

    const amount = Number(amountInput.value);
    const from = fromCurrency.value;
    const to = toCurrency.value;

    const result = document.getElementById("result");
    const rateInfo = document.getElementById("rateInfo");
    const dateInfo = document.getElementById("dateInfo");
    const error = document.getElementById("error");

    error.textContent = "";

    if (!Number.isFinite(amount) || amount <= 0) {
        error.textContent = "Please enter a valid amount.";
        return;
    }

    if (from === to) {
        result.textContent = new Intl.NumberFormat(
            "en-US",
            { style: "currency", currency: to }
        ).format(amount);

        rateInfo.textContent = `1 ${from} = 1 ${to}`;
        dateInfo.textContent = "Same currency";
        return;
    }

    try {
        convertBtn.disabled = true;
        convertBtn.textContent = "Converting...";

        result.textContent = "Loading...";

        const response = await fetch(
            `https://api.frankfurter.dev/v2/rate/${from}/${to}`
        );

        if (!response.ok) {
            throw new Error("Unable to fetch exchange rates.");
        }

        const data = await response.json();

        const convertedAmount = amount * data.rate;

        result.textContent = new Intl.NumberFormat(
            "en-US",
            {
                style: "currency",
                currency: to
            }
        ).format(convertedAmount);

        rateInfo.textContent =
            `1 ${from} = ${data.rate.toFixed(4)} ${to}`;

        dateInfo.textContent =
            `Exchange rate date: ${data.date}`;

    } catch (err) {

        result.textContent = "--";
        error.textContent =
            "Unable to convert currency. Please try again.";

    } finally {
        convertBtn.disabled = false;
        convertBtn.textContent = "Convert Currency";
    }
}

// Convert button
convertBtn.addEventListener("click", convertCurrency);

// Swap currencies
swapBtn.addEventListener("click", () => {

    const temp = fromCurrency.value;

    fromCurrency.value = toCurrency.value;
    toCurrency.value = temp;

    convertCurrency();
});

// Initial conversion
convertCurrency();
