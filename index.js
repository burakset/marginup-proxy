const https = require('https');
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const https = require('https');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// Ana test endpoint
app.get('/', (req, res) => {
    res.send('✅ Sunucu Aktif (Trendyol Resmi API + Cloudflare Fix)');
});

// Trendyol bağlantı test endpointi
app.post('/trendyol/test', async (req, res) => {
    const { sellerId, apiKey, apiSecret } = req.body;

    if (!sellerId || !apiKey || !apiSecret) {
        return res.status(400).json({
            success: false,
            message: 'sellerId, apiKey ve apiSecret zorunludur'
        });
    }

    // Basic Auth oluştur
    const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64');

    // Cloudflare için SNI fix
    const httpsAgent = new https.Agent({
        servername: 'api.trendyol.com'
    });

    try {
        const response = await axios.get(
            `https://api.trendyol.com/sapigw/suppliers/${sellerId}/products`,
            {
                params: { size: 1 },
                headers: {
                    'Authorization': `Basic ${auth}`,
                    'User-Agent': 'MarginUP/1.0',
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Host': 'api.trendyol.com'
                },
                httpsAgent,
                timeout: 10000
            }
        );

        return res.json({
            success: true,
            message: '🎉 Trendyol bağlantısı başarılı',
            sampleProduct: response.data?.content?.[0] || null
        });

    } catch (err) {
        console.error('❌ Trendyol API Hatası:');

        if (err.response) {
            console.error(err.response.data);
            return res.status(err.response.status).json({
                success: false,
                message: 'Trendyol API hata döndü',
                detail: err.response.data
            });
        }

        console.error(err.message);
        return res.status(500).json({
            success: false,
            message: 'Sunucu hatası',
            detail: err.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server ${PORT} portunda çalışıyor`);
});
