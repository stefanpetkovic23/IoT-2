const mysql = require("mysql");
const mqtt = require("mqtt");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "smart_cities",
});

connection.connect((err) => {
  if (err) {
    console.error("Greška prilikom konektovanja na bazu:", err);
    return;
  }
  console.log("Konektovano na MySQL bazu podataka.");
});

const mqttConfig = {
  host: "192.168.99.100", // Adresa EMQX MQTT brokera
  port: 1883,
  username: "admin",
  password: "qwert123",
};

async function getCityById(cityId) {
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT * FROM SmartCities WHERE Id = ?",
      [cityId],
      (error, results) => {
        if (error) {
          reject(error);
          return;
        }
        if (results.length === 0) {
          resolve(null);
        } else {
          resolve(results[0]);
        }
      }
    );
  });
}

async function sendCityDataOverMQTT() {
  const cityCount = 150;
  const topic = "sensor_dummy/values";

  const mqttClient = mqtt.connect(mqttConfig);

  mqttClient.on("connect", async () => {
    console.log("Connected to MQTT broker");

    let cityIndex = 1; // Početni indeks grada

    const interval = setInterval(async () => {
      try {
        const city = await getCityById(cityIndex);
        if (city) {
          console.log("City data:", city);

          const message = JSON.stringify(city);
          mqttClient.publish(topic, message);
          console.log(`Published data to topic: ${topic}`);
        } else {
          console.log(`City with ID ${cityIndex} not found`);
        }
      } catch (error) {
        console.error("Error fetching city data:", error);
      }

      cityIndex++; // Povecavanje indeksa grada za 1

      if (cityIndex > cityCount) {
        clearInterval(interval); // Zaustavi interval ako su svi gradovi poslani
        mqttClient.end();
        console.log("Finished publishing all city data");
      }
    }, 5000);
  });
}

sendCityDataOverMQTT();
