// Base API URL
const BASE_API_URL = "https://api-krs.ms.gov.pl/api/krs/OdpisPelny";

// Button, Input, and Data Container Elements
const fetchDataBtn = document.getElementById("fetch-data-btn");
const krsInput = document.getElementById("krs-input");
const dataContainer = document.getElementById("data-container");

// Fetch API Data and Display
async function fetchAndDisplayData() {
    // Get the KRS number entered by the user
    const krsNumber = krsInput.value.trim();

    // Validate input
    if (!krsNumber) {
        alert("Please enter a valid KRS number.");
        return;
    }

    // Construct the full API URL
    const apiUrl = `${BASE_API_URL}/${krsNumber}?rejestr=P&format=json`;

    try {
        // Fetch data from the API
        const response = await fetch(apiUrl);

        // Handle HTTP errors
        if (!response.ok) {
            throw new Error(`API Error: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();

        // Display the data
        displayData(data);

    } catch (error) {
        console.error(error);
        dataContainer.innerHTML = `<p>Error: ${error.message}</p>`;
    }
}

// Display Data in HTML
function displayData(data) {
    // Clear existing content
    dataContainer.innerHTML = "";

    // Render JSON data as formatted text
    dataContainer.textContent = JSON.stringify(data, null, 2);
}

// Attach Click Event Listener to Button
fetchDataBtn.addEventListener("click", fetchAndDisplayData);