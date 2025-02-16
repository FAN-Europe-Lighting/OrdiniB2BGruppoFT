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
                body: JSON.stringify({ error: "JSON non valido nel body della richiesta", details: error.message }),
            };
        }
    } else {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: "Body della richiesta mancante" }),
        };
    }

    const tableName = bodyData.table;
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

        const responseBody = await response.text(); // ✅ Leggiamo il testo completo della risposta

        if (!response.ok) {
            console.error("❌ Errore Airtable:", responseBody);
            return {
                statusCode: response.status,
                body: JSON.stringify({ error: `Errore API Airtable: ${response.statusText}`, details: responseBody }),
            };
        }

        return {
            statusCode: 200,
            body: responseBody, // ✅ Restituiamo il JSON completo della risposta
        };
    } catch (error) {
        console.error("❌ Errore Generale:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Errore Generale", details: error.message }),
        };
    }
};
