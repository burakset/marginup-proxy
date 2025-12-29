// GPT'nin dediği mantık, ama sunucunun çökmemesi için 'require' kullanıyoruz.
const express = require('express');
const cors = require('cors');
const app = express();

// DigitalOcean'ın verdiği portu kullan yoksa 3000'i kullan
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// 1. Ana Sayfa (Test İçin)
app.get('/', (req, res) => {
    res.send('✅ Sunucu ÇALIŞIYOR! (Node 18 Native Fetch)');
});

// 2. Trendyol Proxy (GPT'nin bahsettiği Backend işlemi)
app.post('/trendyol-proxy', async (req, res) => {
    try {
        // Ön yüzden gelen verileri al
        const { url, method, headers, body } = req.body;
        console.log(`📩 İstek Geldi: ${url}`);

        // Backend üzerinden Trendyol'a git (Node.js'in kendi fetch'i ile)
        const response = await fetch(url, {
            method: method || 'GET',
            headers: headers,
            body: body ? JSON.stringify(body) : undefined
        });

        // Trendyol'dan gelen cevabı (Hata bile olsa) oku
        const responseText = await response.text();

        try {
            // Eğer JSON ise (Başarılıysa) çevir ve gönder
            const data = JSON.parse(responseText);
            res.status(response.status).json(data);
        } catch (err) {
            // Eğer HTML hatası geldiyse (Satıcı bulunamadı vs.) aynen gönder
            console.log("Trendyol'dan HTML Geldi:", responseText);
            res.status(response.status).send(responseText);
        }

    } catch (error) {
        console.error("Sunucu İçi Hata:", error.message);
        res.status(500).json({ error: error.message });
    }
});

// Sunucuyu Başlat
app.listen(PORT, () => {
    console.log(`🚀 Sunucu ${PORT} portunda dinliyor...`);
});
