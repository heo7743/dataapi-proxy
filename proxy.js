const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const BASE_URL = 'https://apis.data.go.kr/B552735/kisedKstartupService01';
const SERVICE_KEY = process.env.SERVICE_KEY;

// 공통 프록시 요청 핸들러
const proxyHandler = (endpoint) => {
  return async (req, res) => {
    try {
      const params = {
        serviceKey: SERVICE_KEY,
        page: req.query.page || 1,
        perPage: req.query.perPage || 10,
        returnType: req.query.returnType || 'json'
      };

      // cond[...] 형식 필터링
      Object.entries(req.query).forEach(([key, value]) => {
        if (key.startsWith('cond[')) {
          params[key] = value;
        }
      });

      const result = await axios.get(`${BASE_URL}/${endpoint}`, { params });
      res.json(result.data);
    } catch (error) {
      console.error('프록시 요청 실패:', error.response?.data || error.message);
      res.status(500).json({ error: '프록시 오류', detail: error.message });
    }
  };
};

// 엔드포인트 라우팅
app.get('/business', proxyHandler('getBusinessInformation01'));
app.get('/announcement', proxyHandler('getAnnouncementInformation01'));
app.get('/content', proxyHandler('getContentInformation01'));
app.get('/stat', proxyHandler('getStatisticalInformation01'));

// 테스트 경로
app.get('/test', (req, res) => {
  res.send('✅ 프록시 서버 정상 작동 중');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🔄 Proxy server running on port ${PORT}`);
});
