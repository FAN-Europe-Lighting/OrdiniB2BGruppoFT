const fetch = require("node-fetch");

exports.handler = async (event) => {
  const { AIRTABLE_API_KEY, AIRTABLE_BASE_ID } = process.env;

  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Variabili di ambiente mancanti" }),
    };
  }

  let url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}`;
  let method = event.httpMethod;
  let headers = {
    Authorization: `Bearer ${AIRTABLE_API_KEY}`,
    "Content-Type": "application/json",
  };

  try {
    if (method === "GET") {
      if (!event.queryStringParameters.table) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: "Parametro 'table' mancante" }),
        };
      }
      url += `/${event.queryStringParameters.table}`;
    } else if (method === "POST") {
      const bodyData = JSON.parse(event.body);
      if (!bodyData.table || !bodyData.records) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: "Dati mancanti" }),
        };
      }
      url += `/${bodyData.table}`;
    }

    const response = await fetch(url, {
      method,
      headers,
      body: method === "POST" ? JSON.stringify({ records: bodyData.records }) : null,
    });

    const data = await response.json();
    return { statusCode: response.status, body: JSON.stringify(data) };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
