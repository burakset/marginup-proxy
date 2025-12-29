const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('✅ MarginUp Proxy Sunucusu Aktif! (v2.0)');
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

        // ÖNCE cevabı düz yazı (text) olarak alıyoruz
        const responseText = await response.text();

        // ŞİMDİ JSON'a çevirmeyi deniyoruz
        try {
            const data = JSON.parse(responseText);
            res.json(data); // JSON ise gönder
        } catch (jsonError) {
            // JSON değilse (HTML ise) hatayı olduğu gibi gönder ki görelim
            console.error("Trendyol HTML Döndü:", responseText);
            res.status(response.status || 500).send(responseText);
        }

    } catch (error) {
        console.error("Sunucu Hatası:", error.message);
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Sunucu ${PORT} portunda çalışıyor.`);
});
app.listen(PORT, () => {
    console.log(`Sunucu ${PORT} portunda çalışıyor.`);
});
