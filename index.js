const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('✅ MarginUp Proxy Sunucusu Aktif! (DigitalOcean)');
});

app.post('/trendyol-proxy', async (req, res) => {
    try {
        const { url, method, headers, body } = req.body;
        console.log(`📩 İstek Geldi: ${url}`);

        const response = await fetch(url, {
            method: method || 'GET',
            headers: headers,
            body: body ? JSON.stringify(body) : undefined
        });

        const data = await response.json();
        res.json(data);

    } catch (error) {
        console.error("Hata:", error.message);
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Sunucu ${PORT} portunda çalışıyor.`);
});
