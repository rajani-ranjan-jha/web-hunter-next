async function fetchFromSpreadsheet() {
  // REPLACE THESE with your actual values
  const API_KEY = "AIzaSyDszMLwJxETtEyUPVwyIBZOwvFjLsSbo5Y";
  // const API_KEY = process.env.GOOGLE_CLOUD_CONSOLE;
  const SHEET_ID = "15u2Vlfn8oXJMxBNTCo-tT_TJNc9osu_5xLT2mctlw-Q";
  const RANGE = "Sheet1!A1:Z1000"; // Adjust range as needed

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`;

  try {
    const response = await fetch(url);
    const result = await response.json();

    if (result.error) {
      console.error("API Error:", result.error);
      return;
    }

    const rows = result.values;
    const headers = rows[0];
    // console.log(rows)
    // console.log(headers) //[ 'URL', 'TITLE', 'DESCRIPTION' ]

    //structuring
    const data = rows.slice(1).map((row) => {
      const obj = {};
      headers.forEach((header, index) => {
        if (row[index] !== "#N/A" && row[index].length > 3) {
          obj[header.toLowerCase()] = row[index] || null;
        }
      });
      return obj;
    });

    const filteredData = data.filter(
      (d) => d.url != null && d.name != null && d.description != null
    );

    async function Format(data) {
      data.forEach(async (obj) => {
        obj.name = await obj.name.split(/\s*[|\-–—:•►»>~]\s*/)[0];

        obj.description = await obj.description.replaceAll(/\s+/g, " ");
        // return obj
      });
      return data;
    }

    // console.log("Fetched spreadsheets ", );
    return await Format(filteredData)
  } catch (error) {
    console.error("Error in speadsheet.js :", error);
  }
}

// await fetchFromSpreadsheet();

export { fetchFromSpreadsheet };
