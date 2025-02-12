const fetch = require("node-fetch");

exports.handler = async (event) => {
  try {
    // Ottieni i dati dal corpo della richiesta
    const formData = JSON.parse(event.body);

    // URL del tuo Google Apps Script (mettilo come variabile d'ambiente in Netlify)
    const googleSheetUrl = process.env.GOOGLE_SHEET_URL;

    // Effettua la richiesta POST verso Google Apps Script
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
