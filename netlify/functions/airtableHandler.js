const fetch = require("node-fetch");

exports.handler = async (event) => {
  const { AIRTABLE_API_KEY, AIRTABLE_BASE_ID } = process.env;

  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Variabili di ambiente mancanti" }),
    };
  }

  let bodyData = {};
  
  // ✅ Controlliamo se è una richiesta GET o POST
  if (event.httpMethod === "POST") {
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Body della richiesta mancante" }),
      };
    }
    try {
      bodyData = JSON.parse(event.body);
    } catch (error) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "JSON non valido nel body della richiesta" }),
      };
    }
  }

  // ✅ Controlliamo se 'table' è passato come query param (GET) o nel body (POST)
  const tableName = event.httpMethod === "GET"
    ? event.queryStringParameters.table
    : bodyData.table;

  if (!tableName) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Parametro 'table' mancante" }),
    };
  }

  const airtableUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(tableName)}`;
  
  const headers = {
    Authorization: `Bearer ${AIRTABLE_API_KEY}`,
    "Content-Type": "application/json",
  };

  try {
    const response = await fetch(airtableUrl, {
      method: event.httpMethod,
      headers,
      body: event.httpMethod === "POST" ? JSON.stringify({ records: bodyData.records }) : null,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Errore API Airtable: ${response.statusText} - ${errorText}`);
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
