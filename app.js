const express = require("express");
const app = express();
const port = 5000;

app.use(express.json());
const { Client, LocalAuth } = require("whatsapp-web.js");

const qrcode = require("qrcode-terminal"); // qr code geneartion

const client = new Client({
  authStrategy: new LocalAuth({
    clientId: "YOUR_CLIENT_ID", // uniqu
  }),
  // proxyAuthentication: { username: 'username', password: 'password' },
  puppeteer: {
    // args: ['--proxy-server=proxy-server-that-requires-authentication.example.com'],
    headless: false,
  },
});
client.initialize();

client.on("ready", () => {
  console.log("WhatsApp Client is ready!");
});


client.on("loading_screen", (percent, message) => {
  console.log("LOADING SCREEN", percent, message);
});

client.on("qr", (qr) => {
  console.log("QR RECEIVED", qr);
  // qrcode.generate(qr, { small: true });
});

client.on("authenticated", () => {
  console.log("AUTHENTICATED");
});

client.on("auth_failure", (msg) => {
  // Fired if session restore was unsuccessful
  console.error("AUTHENTICATION FAILURE", msg);
});

client.on('message', async msg => {
  if(msg.hasMedia) {
      const media = await msg.downloadMedia();
      console.log("my file"+media);
  }
});

// send message route
app.post("/send-message", async (req, res) => {
  const { mobilenumber, message } = req.body;
  try {
    await client.sendMessage(`${mobilenumber}@c.us`, `${message}`);
    res.json({ success: true ,message:"message send successfully"});
  } catch (error) {
    console.error("Error sending messages:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});


//for demo test
// client.on("ready", () => {
//     console.log("READY");
//     client.sendMessage("918015523808@c.us", "hello.........!");
// });

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


