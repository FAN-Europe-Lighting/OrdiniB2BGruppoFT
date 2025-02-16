const fetch = require("node-fetch");

exports.handler = async (event) => {
  const { AIRTABLE_API_KEY, AIRTABLE_BASE_ID } = process.env;

  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Variabili di ambiente mancanti" }),
    };
  }

  const { path, method, body } = event;
  const airtableUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}`;

  const headers = {
    Authorization: `Bearer ${AIRTABLE_API_KEY}`,
    "Content-Type": "application/json",
  };

  try {
    const response = await fetch(`${airtableUrl}${path}`, {
      method,
      headers,
      body: method === "POST" ? body : null,
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
