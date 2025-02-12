const fetch = require("node-fetch");

exports.handler = async (event) => {
  if (event.httpMethod === "GET") {
    return {
      statusCode: 200,
      body: JSON.stringify({ apiUrl: process.env.GOOGLE_SHEET_URL }),
    };
  }

  try {
    const formData = JSON.parse(event.body);
    const googleSheetUrl = process.env.GOOGLE_SHEET_URL;

    const response = await fetch(googleSheetUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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
    console.error("Errore durante l'invio al Google Sheet:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: error.message }),
    };
  }
};

