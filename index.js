const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Test endpoint
app.get('/', (req, res) => {
    res.send('✅ Sunucu Aktif (Trendyol Resmi API)');
});

// Trendyol bağlantı testi
app.post('/trendyol/test', async (req, res) => {
    const { sellerId, apiKey, apiSecret } = req.body;

    // 1️⃣ Basic Auth oluştur
    const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64');

    try {
        // 2️⃣ Resmi Trendyol API çağrısı
        const response = await axios.get(
            `https://api.trendyol.com/sapigw/suppliers/${sellerId}/products`,
            {
                params: { size: 1 },
                headers: {
                    'Authorization': `Basic ${auth}`,
                    'User-Agent': 'YourStartupName/1.0',
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                timeout: 10000
            }
        );

        // 3️⃣ Başarılıysa
        res.json({
            success: true,
            message: '🎉 Trendyol bağlantısı başarılı',
            sampleProduct: response.data?.content?.[0] || null
        });

    } catch (err) {
        // 4️⃣ Hata varsa
        console.error('❌ Trendyol API Hatası:', err.response?.data || err.message);

        res.status(400).json({
            success: false,
            message: 'Trendyol bağlantı hatası',
            detail: err.response?.data || err.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server ${PORT} portunda çalışıyor`);
});
