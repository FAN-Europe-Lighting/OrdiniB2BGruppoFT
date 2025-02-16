const fetch = require("node-fetch");

exports.handler = async (event) => {
  const { AIRTABLE_API_KEY, AIRTABLE_BASE_ID } = process.env;

  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Variabili di ambiente mancanti" }),
    };
  }

  // ✅ Verifica il metodo HTTP e analizza il body
  let bodyData;
  if (event.body) {
    try {
      bodyData = JSON.parse(event.body);
    } catch (error) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "JSON non valido nel body della richiesta" }),
      };
    }
  } else {
    bodyData = {}; // Inizializza bodyData se è vuoto
  }

  const tableName = event.queryStringParameters.table;
  if (!tableName) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Parametro 'table' mancante" }),
    };
  }

  const airtableUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${tableName}`;
  const headers = {
    Authorization: `Bearer ${AIRTABLE_API_KEY}`,
    "Content-Type": "application/json",
  };

  try {
    const response = await fetch(airtableUrl, {
      method: event.httpMethod,
      headers,
      body: event.httpMethod === "POST" ? JSON.stringify(bodyData) : null,
    });

    if (!response.ok) {
      throw new Error(`Errore API Airtable: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error("❌ Errore Airtable:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
