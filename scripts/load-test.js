import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 50, // Virtual Users
  duration: '30s',
  thresholds: {
    http_req_duration: ['p(95)<200'], // 95% of requests must be under 200ms
  },
};

export default function () {
  const url = 'http://localhost:8787/health';
  const res = http.get(url);
  
  check(res, {
    'status is 200': (r) => r.status === 200,
    'latency is low': (r) => r.timings.duration < 100,
  });
  
  sleep(1);
}