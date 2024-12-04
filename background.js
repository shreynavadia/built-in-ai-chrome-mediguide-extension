chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
    if (request.message === "fetch_medicine_data") {
        // Prompts tailored to user-selected options
        const prompts = {
            "Description": `Provide a concise product description in bullet points for "${request.medicine}", including:
                            - What it is used for.
                            - Key ingredients.
                            Do not include any other information.`,
            "Dosage": `Provide detailed dosage instructions for "${request.medicine}". Do not include other information.`,
            "Side-Effects": `List the side effects of "${request.medicine}" in bullet points. Exclude other details.`,
            "Alternatives": `Suggest a few alternatives to "${request.medicine}" in bullet points. Do not include other information.`
        };

        const prompt = prompts[request.option] || `Provide information about "${request.medicine}".`;

        const session = await ai.languageModel.create({
            systemPrompt: `You are a helpful assistant providing medicine-related information.`,
        });

        const tabId = sender.tab.id;

        try {
            let promptResp = await session.prompt(prompt);

            const formattedResponse = formatResponseWithEmptyLines(promptResp);

            chrome.tabs.sendMessage(tabId, {
                message: "medicine_data_fetched",
                option: request.option,
                promptResp: formattedResponse 
            });
        } catch (error) {
            chrome.tabs.sendMessage(tabId, {
                message: "medicine_data_error",
                error: error.message || "An error occurred while fetching data."
            });
        }
    }
});

function formatResponseWithEmptyLines(response) {
    const lines = response
        .split("\n") 
        .map(line => line.trim()) 
        .filter(line => line); 

    return lines.join("\n\n"); 
}
