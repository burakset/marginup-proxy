const express = require('express');
const cors = require('cors');
// Node 18+ sürümünde fetch yerleşiktir, çağırmaya gerek yok.
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// 1. Ana Sayfa Testi
app.get('/', (req, res) => {
    res.send('✅ MarginUp Proxy (v3.0 - Native Fetch)');
});

// 2. Trendyol Proxy (Düzeltilmiş)
app.post('/trendyol-proxy', async (req, res) => {
    try {
        const { url, method, headers, body } = req.body;
        console.log(`📩 İstek: ${url}`);

        // Node.js'in kendi fetch'ini kullanıyoruz
        const response = await fetch(url, {
            method: method || 'GET',
            headers: headers,
            body: body ? JSON.stringify(body) : undefined
        });

        // Gelen cevabı önce yazı olarak alıp kontrol edelim
        const responseText = await response.text();

        try {
            // Eğer JSON ise çevir ve gönder
            const data = JSON.parse(responseText);
            res.status(response.status).json(data);
        } catch (err) {
            // Eğer HTML hata sayfası geldiyse, hatayı olduğu gibi göster
            console.log("Trendyol HTML Döndü:", responseText);
            res.status(response.status).send(responseText);
        }

    } catch (error) {
        console.error("Sunucu Hatası:", error.message);
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Sunucu ${PORT} portunda başarıyla başladı.`);
});
