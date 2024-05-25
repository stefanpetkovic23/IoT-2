const express = require("express");
const mqtt = require("mqtt");

const app = express();
const port = 3000;

// Postavke za MQTT povezivanje
const brokerAddress = "mqtt://192.168.99.100"; // Adresa MQTT brokera
const topicToSubscribe = "eKuiper/anomalies";

const client = mqtt.connect(brokerAddress);

client.on("connect", () => {
  console.log("Connected to MQTT broker");

  // Pretplaćivanje na temu za primanje podataka
  client.subscribe(topicToSubscribe, (err) => {
    if (err) {
      console.error("Error subscribing to topic:", err);
    } else {
      console.log(`Subscribed to topic: ${topicToSubscribe}`);
    }
  });
});

// Obrada primljenih poruka
client.on("message", (topic, message) => {
  const payload = message.toString();

  console.log(`Received message on topic: ${topic}`);
  console.log(`Payload: ${payload}`);

  filteredData.push(JSON.parse(payload));
});

const filteredData = []; // Ovde čuvamo filtrirane podatke
client.on("message", (topic, message) => {
  if (topic === topicToSubscribe) {
    const payload = message.toString();
  }
});

app.get("/filtered-data", (req, res) => {
  res.json(filteredData);
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
