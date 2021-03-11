const https = require("https");
const key = process.env.REALTOR_API_KEY;
const myDomain = process.env.DOMAIN;

function generateResponse(code, payload) {
  return {
    statusCode: code,
    headers: {
      "Access-Control-Allow-Origin": myDomain,
      "Access-Control-Allow-Headers": "x-requested-with",
      "Access-Control-Allow-Credentials": true
    },
    body: JSON.stringify(payload)
  };
}

function generateError(code, err) {
  console.log(err);
  return {
    statusCode: code,
    headers: {
      "Access-Control-Allow-Origin": myDomain,
      "Access-Control-Allow-Headers": "x-requested-with",
      "Access-Control-Allow-Credentials": true
    },
    body: JSON.stringify(err.message)
  };
}

module.exports.send = async (event) => {
  try {
    const { minPrice, maxPrice, city, limit, stateCode } = event.queryStringParameters;
    const { realtorEndpoint } = event.queryStringParameters;
    let dataString = "";
    let path = "";
    
    const response = await new Promise((resolve, reject) => {
      switch (realtorEndpoint) {
        case "featured-houses":
          if (!(minPrice && maxPrice && city && limit && stateCode)) {
            throw new Error("Missing parameters! Make sure to add parameters \'minPrice\', \'maxPrice\', \'city\', \'limit\', \'stateCode\'.");
          }
          path = `/properties/v2/list-for-sale?price_min=${minPrice}&sort=relevance&price_max=${maxPrice}&sqft_min=1&city=${city}&limit=${limit}&offset=0&state_code=${stateCode}`;
          break;
        case "city-and-state-code":
          const { location } = event.queryStringParameters;
          if (!location) {
            throw new Error("Missing parameters! Make sure to add parameters \'location\'.");
          }
          path = `/locations/auto-complete?input=${location}`;
          break;
        case "houses-for-sale":
          const { action, sort } = event.queryStringParameters;
          if (!(action && minPrice && sort && maxPrice && city && limit && stateCode)) {
            throw new Error("Missing parameters! Make sure to add parameters \'action\', \'minPrice\', \'sort\', \'maxPrice\', \'city\', \'limit\', \'stateCode\'.");
          }
          path = `/properties/v2/list-${action}?price_min=${minPrice}&sort=${sort}&price_max=${maxPrice}&sqft_min=1&city=${city}&limit=${limit}&offset=0&state_code=${stateCode}`;
          break;
      }
      
      const options = {
        "method": "GET",
        "hostname": "realtor.p.rapidapi.com",
        "port": null,
        "path": path,
        "headers": {
          "x-rapidapi-key": key,
          "x-rapidapi-host": "realtor.p.rapidapi.com",
          "useQueryString": true
        }
      };
  
      const req = https.request(options, function (res) {
        res.on("data", chunk => {
          dataString += chunk;
        });
  
        res.on("end", () => {
          console.log(JSON.parse(dataString));
          resolve(generateResponse(200, JSON.parse(dataString)));
        });
  
      });
  
      req.on('error', (e) => {
        reject(generateError(500, 'Something went wrong!'));
      });

      req.end();
    });
  
    return response;
  } catch (err) {
    return generateError(500, err);
  }
};
