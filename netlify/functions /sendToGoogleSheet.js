const fetch = require("node-fetch");

exports.handler = async (event) => {
  const googleSheetUrl = process.env.GOOGLE_SHEET_URL;

  if (!googleSheetUrl) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: "GOOGLE_SHEET_URL non configurato in Netlify." }),
    };
  }

  if (event.httpMethod === "GET") {
    return {
      statusCode: 200,
      body: JSON.stringify({ apiUrl: googleSheetUrl }),
    };
  }

  try {
    const formData = JSON.parse(event.body);

    const response = await fetch(googleSheetUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error(`Errore API Google Sheet: ${response.statusText}`);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  } catch (error) {
    console.error("❌ Errore durante l'invio al Google Sheet:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: error.message }),
    };
  }
};
