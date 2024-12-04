const optionsContainer = document.createElement("div");
optionsContainer.style = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 9999;
    display: none;
    flex-direction: column;
    gap: 10px;
    padding: 10px;
    background: rgba(255, 255, 255, 0.8); /* Frosted glass effect */
    backdrop-filter: blur(8px); /* Apply blur */
    border-radius: 15px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

const loader = document.createElement("div");
loader.style = `
    display: none;
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 10000;
    width: 50px;
    height: 50px;
    border: 5px solid #C9B79C; /* Khaki */
    border-top: 5px solid #342A21; /* Bistre */
    border-radius: 50%;
    animation: spin 1s linear infinite;
`;

const backButton = document.createElement("button");
backButton.innerText = "Back to Options";
backButton.style = `
    display: none;
    position: fixed;
    bottom: 330px; /* Above the response container */
    right: 20px;
    z-index: 9999;
    padding: 10px 20px;
    background: rgba(255, 255, 255, 0.8);
    border: 2px solid #71816D; /* Reseda green */
    border-radius: 5px;
    cursor: pointer;
    font-size: 14px;
    color: #71816D;
`;

const responseContainer = document.createElement("div");
responseContainer.style = `
    display: none;
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 9999;
    background: rgba(255, 255, 255, 0.8);
    padding: 10px;
    border: 2px solid #342A21; /* Bistre */
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    overflow: auto;
    max-height: 300px;
    width: 300px;
`;

// Spinner animation
const loaderStyle = document.createElement("style");
loaderStyle.innerHTML = `
@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}`;
document.head.appendChild(loaderStyle);

document.body.appendChild(optionsContainer);
document.body.appendChild(loader);
document.body.appendChild(responseContainer);
document.body.appendChild(backButton);

let medicineName = "";

function createOptionButton(optionText, borderColor) {
    const button = document.createElement("button");
    button.innerText = optionText;
    button.style = `
        padding: 10px 20px;
        border: 2px solid ${borderColor};
        border-radius: 5px;
        cursor: pointer;
        background: rgba(255, 255, 255, 0.8); /* Frosted look */
        font-size: 14px;
        color: ${borderColor}; /* Match text color with border color */
    `;
    button.addEventListener("click", () => {
        optionsContainer.style.display = "none";
        loader.style.display = "block";

        chrome.runtime.sendMessage({
            message: "fetch_medicine_data",
            medicine: medicineName,
            option: optionText
        });
    });
    return button;
}

function showOptions(medicine) {
    medicineName = medicine;

    optionsContainer.innerHTML = "";

    optionsContainer.appendChild(createOptionButton("Description", "#292F36")); 
    optionsContainer.appendChild(createOptionButton("Dosage", "#9B7EDE")); 
    optionsContainer.appendChild(createOptionButton("Side-Effects", "#4ECDC4")); 
    optionsContainer.appendChild(createOptionButton("Alternatives", "#FF6B6B")); 

    optionsContainer.style.display = "flex";
    backButton.style.display = "none";
    responseContainer.style.display = "none";
}


function detectMedicinePage() {
    const url = window.location.href;

    // Check if the website is CVS
    if (url.includes("cvs.com/shop")) {
        // CVS-specific detection logic: Check URL pattern
        const cvsProductPagePattern = /cvs\.com\/shop\/.+-prodid-\d+/; // Matches URLs like cvs.com/shop/...
        const isCVSProductPage = cvsProductPagePattern.test(url);

        if (isCVSProductPage) {
            // Extract information using fallback logic for accuracy
            const medicineElement = document.querySelector(".medicine-title, h1, .product-name, .product-title");
            const addToCartButton = document.querySelector(".add-to-cart, .buy-now, .purchase-button, .add-for-pickup");
            const productDetailsSection = document.querySelector(".product-details, .medicine-info, .drug-details");

            const metaProductName = document.querySelector('meta[property="og:title"], meta[name="product_name"]');
            const metaProductType = document.querySelector('meta[property="og:type"][content="product"], meta[itemprop="productID"]');

            const pageContent = document.body.innerText.toLowerCase() || "";
            const medicineKeywords = ["headache", "pain relief", "capsules", "tablets", "ointment", "syrup", "antibiotic"];
            const containsMedicineKeywords = medicineKeywords.some(keyword => pageContent.includes(keyword));

            const schemaProductType = document.querySelector('[itemtype*="schema.org/Product"]');
            const schemaProductCategory = document.querySelector('[itemprop="category"]');
            const isMedicineCategory =
                schemaProductCategory && /medicine|drug|pharmacy/i.test(schemaProductCategory.textContent.toLowerCase() || "");

            if (
                (medicineElement || addToCartButton || metaProductName || metaProductType || productDetailsSection) &&
                (containsMedicineKeywords || isMedicineCategory || schemaProductType)
            ) {
                const medicine = medicineElement
                    ? medicineElement.innerText.trim()
                    : metaProductName
                    ? metaProductName.content
                    : "Unknown Medicine";

                console.log(`Detected CVS Medicine Page: ${medicine}`);
                showOptions(medicine); // Activate the extension for CVS product pages
                return;
            } else {
                console.log("This CVS product page does not have enough identifiable medicine information.");
                return;
            }
        } else {
            console.log("This page is not a CVS product page.");
            return;
        }
    } else {
        // Fallback logic for other pharmacy websites
        const productPageIndicators = ["product", "item", "detail", "medicine", "pharmacy", "drug"]; // General indicators
        const isLikelyProductPage = productPageIndicators.some(indicator => url.includes(indicator));

        const medicineElement = document.querySelector(".medicine-title, h1, .product-name, .product-title");
        const addToCartButton = document.querySelector(".add-to-cart, .buy-now, .purchase-button, .add-for-pickup");
        const productDetailsSection = document.querySelector(".product-details, .medicine-info, .drug-details");

        const metaProductName = document.querySelector('meta[property="og:title"], meta[name="product_name"]');
        const metaProductType = document.querySelector('meta[property="og:type"][content="product"], meta[itemprop="productID"]');

        const pageContent = document.body.innerText.toLowerCase() || "";
        const medicineKeywords = ["headache", "pain relief", "capsules", "tablets", "ointment", "syrup", "antibiotic"];
        const containsMedicineKeywords = medicineKeywords.some(keyword => pageContent.includes(keyword));

        const schemaProductType = document.querySelector('[itemtype*="schema.org/Product"]');
        const schemaProductCategory = document.querySelector('[itemprop="category"]');
        const isMedicineCategory =
            schemaProductCategory && /medicine|drug|pharmacy/i.test(schemaProductCategory.textContent.toLowerCase() || "");

        if (
            isLikelyProductPage &&
            (medicineElement || addToCartButton || metaProductName || metaProductType || productDetailsSection) &&
            (containsMedicineKeywords || isMedicineCategory || schemaProductType)
        ) {
            const medicine = medicineElement
                ? medicineElement.innerText.trim()
                : metaProductName
                ? metaProductName.content
                : "Unknown Medicine";

            console.log(`Detected medicine product page: ${medicine}`);
            showOptions(medicine); // Activate extension for other pharmacy websites
        } else {
            console.log("This page does not appear to be an individual medicine product page on this pharmacy website.");
        }
    }
}


chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
    if (request.message === "medicine_data_fetched") {
        loader.style.display = "none";

        // Display AI's response cleanly
        const formattedResponse = request.promptResp
            .split("\n")
            .map(line => `<p>${line}</p>`)
            .join("");

        responseContainer.innerHTML = `<h4>${request.option}</h4>${formattedResponse}`;
        responseContainer.style.display = "block";
        backButton.style.display = "block";
    } else if (request.message === "medicine_data_error") {
        loader.style.display = "none";
        alert(`Error: ${request.error}`);
    }
});



chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
    if (request.message === "medicine_data_fetched") {
        loader.style.display = "none";

        const formattedResponse = request.promptResp
            .split("\n")
            .map(line => `<p>${line}</p>`)
            .join("");

        responseContainer.innerHTML = `<h4>${request.option}</h4>${formattedResponse}`;
        responseContainer.style.display = "block";
        backButton.style.display = "block";
    } else if (request.message === "medicine_data_error") {
        loader.style.display = "none";
        alert(`Error: ${request.error}`);
    }
});

backButton.addEventListener("click", () => {
    responseContainer.style.display = "none";
    backButton.style.display = "none";
    optionsContainer.style.display = "flex";
});

window.addEventListener("load", () => {
    setTimeout(detectMedicinePage, 2000);
});
