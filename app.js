const BASE_API_URL = "https://api-krs.ms.gov.pl/api/krs/OdpisAktualny";

const DATA_NOT_FOUND_MESSAGE = "Weź się popraw człowieku";

const fetchDataBtn = document.getElementById("fetch-data-btn");
const krsInput = document.getElementById("krs-input");
const dataContainer = document.getElementById("data-container");


async function fetchAndDisplayData() {
    const krsNumber = krsInput.value.trim().padStart(14, "0");
    if (!krsNumber) {
        alert(DATA_NOT_FOUND_MESSAGE);
        return;
    }
    const apiUrl = `${BASE_API_URL}/${krsNumber}?rejestr=P&format=json`;
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`API Error: ${response.status} - ${response.statusText}`);
        }
        const data = await response.json();

        const formattedData = extractData(data);
        showDataContainer();
        displayData(formattedData);
    } catch (error) {
        console.error(error);
        showErrorMessage(DATA_NOT_FOUND_MESSAGE);
    }
}

function extractField(data, path, defaultValue = "N/A") {
    return path.split('.').reduce((acc, key) => acc?.[key], data) ?? defaultValue;
}

function extractData(data) {
    const danePodmiotu = extractField(data, "odpis.dane.dzial1.danePodmiotu");
    const kapitalZakladowy = extractField(data, "odpis.dane.dzial1.kapital.wysokoscKapitaluZakladowego");
    const adres = extractField(data, "odpis.dane.dzial1.siedzibaIAdres.adres");

    let result = "";

    if (danePodmiotu?.nazwa) {
        result += `Nazwa: ${danePodmiotu.nazwa}\n`;
    } else {
        result += "Nazwa nie została odnaleziona.\n";
    }
    if (danePodmiotu?.identyfikatory.nip) {
        result += `NIP: ${danePodmiotu?.identyfikatory.nip}\n`;
    } else {
        result += "NIP nie została odnaleziony.\n";
    }

    if (data?.odpis?.naglowekA?.numerKRS) {
        result += `KRS: ${data.odpis.naglowekA.numerKRS}\n`;
    } else {
        result += "KRS nie został odnaleziony.\n";
    }

    if (danePodmiotu?.identyfikatory.regon) {
        result += `REGON: ${danePodmiotu?.identyfikatory.regon}\n`;
    } else {
        result += "REGON nie została odnaleziony.\n";
    }

    if (adres && adres.ulica && adres.nrDomu && adres.kodPocztowy && adres.miejscowosc) {
        result += `Adres: ${adres.ulica} ${adres.nrDomu}, ${adres.kodPocztowy} ${adres.miejscowosc}\n`;
    } else {
        result += "Adres nie został odnaleziony.\n";
    }

    if (kapitalZakladowy?.wartosc && kapitalZakladowy?.waluta) {
        result += `Wysokość Kapitału Zakładowego: ${kapitalZakladowy.wartosc} ${kapitalZakladowy.waluta}\n`;
    } else {
        result += "Wysokość kapitału zakładowego nie została odnaleziona.\n";
    }

    return result;
}

function displayData(data) {
    dataContainer.innerHTML = "";
    dataContainer.textContent = data;
}

function showDataContainer() {
    if (dataContainer) {
        dataContainer.hidden = false;
    }
}

function showErrorMessage(message) {
    dataContainer.innerHTML = `<p>${message}</p>`;
}

fetchDataBtn.addEventListener("click", fetchAndDisplayData);

krsInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        fetchDataBtn.click();
    }
});
