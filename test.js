import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  vus: 280, // 🔥 200 usuários simultâneos
  duration: '30s', // tempo do teste
};

export default function () {

  const res = http.get('http://localhost:3001/veiculos/empresa', {
    headers: {
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1wcmVzYV9pZCI6MSwibWFzdGVyIjp0cnVlLCJ0aXBvIjoiYWRtaW4iLCJpYXQiOjE3NzY1Njg5ODIsImV4cCI6MTc3NjU3MjU4Mn0.-xuUoKx9rJpmYivNpdkibaj8VndXeMezN5yquiHxv0s',
      'x-loja-id': '1'
    }
  });

  sleep(1); // simula usuário real (1s entre ações)
}