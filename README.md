# MediGuide - Chrome Extension for Medicine Information

MediGuide is a user-friendly Chrome extension designed to assist users in quickly accessing detailed information about medicines directly from pharmacy websites, such as CVS. With just a few clicks, users can retrieve essential details like descriptions, dosages, side effects, and alternatives for medicines. 

*Currently Chrome' Built-in AI is only available on Chrome Canary*
---

## Features

- **Automatic Medicine Detection**: The extension intelligently detects medicine product pages on supported pharmacy websites.
- **Detailed Information Retrieval**:
  - Description: Provides concise details about the medicine, including its use and key ingredients.
  - Dosage: Offers clear dosage instructions.
  - Side-Effects: Lists potential side effects of the medicine.
  - Alternatives: Suggests alternatives to the detected medicine.
- **Intuitive UI**: A clean and interactive interface with options displayed in frosted-glass-themed buttons.
- **Real-Time AI Assistance**: Leverages Chrome’s built-in AI prompt API to fetch accurate and concise medicine information.

---

## How We Built It
  
  - Utilized **Chrome’s built-in AI prompt API** to process user-selected options and fetch relevant medicine information dynamically.
  - Applied fallback logic to detect medicine pages using structured metadata, schema information, and relevant keywords in the page content.
  - Incorporated **DOM manipulation** to extract relevant data from the pharmacy web pages.
  - Enhanced page detection with URL pattern matching, schema metadata, and keyword analysis.

---

## How It Works

1. **Medicine Detection**:
   - Automatically scans the pharmacy web page for URL patterns and page metadata to detect medicine products.
2. **User Interaction**:
   - Once a medicine is detected, a floating widget displays options such as `Description`, `Dosage`, `Side-Effects`, and `Alternatives`.
3. **Data Retrieval**:
   - When an option is clicked, the extension sends a request to Chrome’s AI prompt API to fetch specific information related to the medicine.
4. **Display**:
   - Information is formatted with line spacing for readability and presented in a sleek pop-up container.


1. Clone or download the repository:
   ```bash
   git clone https://github.com/shreynavadia/built-in-ai-chrome-mediguide-extension.git
