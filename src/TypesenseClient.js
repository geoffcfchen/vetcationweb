// src/TypesenseClient.js
import Typesense from "typesense";

const TypesenseClient = new Typesense.Client({
  nodes: [
    {
      host: "bgjtxhcr5s4vy9kip-1.a1.typesense.net",
      port: "443",
      protocol: "https",
    },
  ],
  apiKey: "kcY27AtRxSmsQiXcC3Tfl7P8Dsj4Xn41",
  connectionTimeoutSeconds: 2,
});

export default TypesenseClient;
