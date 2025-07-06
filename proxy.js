const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();

app.get('/business', async (req, res) => {
  const { page = 1, perPage = 10, returnType = 'json', cond } = req.query;

  try {
    const result = await axios.get('https://apis.data.go.kr/B552735/kisedKstartupService01/getBusinessInformation01', {
      params: {
        serviceKey: process.env.SERVICE_KEY,
        page,
        perPage,
        returnType,
        ...(cond ? { 'cond[biz_category_cd::EQ]': cond } : {})
      }
    });

    res.json(result.data);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: '프록시 서버 오류' });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log('서버 실행 중');
});

