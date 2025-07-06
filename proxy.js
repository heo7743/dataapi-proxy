const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();

// 기본 설정
const BASE_URL = 'https://apis.data.go.kr/B552735/kisedKstartupService01';
const SERVICE_KEY = process.env.SERVICE_KEY;

// 공통 요청 함수
const proxyRequest = async (endpoint, clientParams, res) => {
  try {
    // cond 파라미터만 별도로 파싱해줌
    const condRaw = clientParams.cond;
    const cond = {};

    if (condRaw) {
      // 예: "biz_category_cd::EQ=cmrczn_Tab3"
      const [fullKey, value] = condRaw.split('=');
      if (fullKey && value) {
        cond[`cond[${fullKey}]`] = value;
      }
    }

    const params = {
      serviceKey: SERVICE_KEY,
      page: clientParams.page || 1,
      perPage: clientParams.perPage || 10,
      returnType: clientParams.returnType || 'json',
      ...cond
    };

    const response = await axios.get(`${BASE_URL}/${endpoint}`, { params });
    res.json(response.data);
  } catch (error) {
    console.error('Proxy error:', error.response?.data || error.message);
    res.status(500).json({ error: '프록시 서버 오류' });
  }
};

// 각 경로 설정
app.get('/business', (req, res) => {
  proxyRequest('getBusinessInformation01', req.query, res);
});

app.get('/announcement', (req, res) => {
  proxyRequest('getAnnouncementInformation01', req.query, res);
});

app.get('/content', (req, res) => {
  proxyRequest('getContentInformation01', req.query, res);
});

app.get('/stat', (req, res) => {
  proxyRequest('getStatisticalInformation01', req.query, res);
});

// 테스트용 엔드포인트
app.get('/test', (req, res) => {
  res.send('✅ 프록시 서버 정상 작동 중');
});

// Vercel 호환 포트 설정
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Proxy server running at http://localhost:${PORT}`);
});
