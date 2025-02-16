const fetch = require("node-fetch");

exports.handler = async (event) => {
  const { AIRTABLE_API_KEY, AIRTABLE_BASE_ID } = process.env;

  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Variabili di ambiente mancanti" }),
    };
  }

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
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Body della richiesta mancante" }),
    };
  }

  if (!bodyData.table) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Parametro 'table' mancante" }),
    };
  }

  const tableName = encodeURIComponent(bodyData.table); // ✅ Evitiamo errori sui nomi tabella con spazi
  const airtableUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${tableName}`;
  
  const headers = {
    Authorization: `Bearer ${AIRTABLE_API_KEY}`,
    "Content-Type": "application/json",
  };

  try {
    const response = await fetch(airtableUrl, {
      method: "POST",
      headers,
      body: JSON.stringify({ records: bodyData.records }),
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
