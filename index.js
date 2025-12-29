const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// 1. Ana Sayfa
app.get('/', (req, res) => {
    res.send('✅ Sunucu Aktif (V6 - Anti-Cloudflare Mode)');
});

// 2. Trendyol Proxy (Kılık Değiştirmiş Versiyon)
app.post('/trendyol-proxy', async (req, res) => {
    try {
        const { url, method, headers, body } = req.body;
        console.log(`🕵️‍♂️ Gizli İstek Gönderiliyor: ${url}`);

        // BURASI ÇOK ÖNEMLİ: Kendimizi Chrome gibi tanıtıyoruz
        const fakeHeaders = {
            ...headers, // Senin gönderdiğin şifreler (Authorization)
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'application/json',
            'Accept-Language': 'tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive'
        };

        const response = await fetch(url, {
            method: method || 'GET',
            headers: fakeHeaders,
            body: body ? JSON.stringify(body) : undefined
        });

        const responseText = await response.text();

        // Cloudflare engelini kontrol et
        if (responseText.includes('Cloudflare') || responseText.includes('blocked')) {
            console.log("❌ Cloudflare yine yakaladı!");
            return res.status(403).json({ error: "Cloudflare engeli! IP adresi şüpheli bulundu." });
        }

        try {
            const data = JSON.parse(responseText);
            res.status(response.status).json(data);
        } catch (err) {
            console.log("⚠️ HTML Geldi:", responseText.substring(0, 100) + "...");
            res.status(response.status).send(responseText);
        }

    } catch (error) {
        console.error("Sunucu Hatası:", error.message);
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Sunucu ${PORT} portunda gizlendi.`);
});
