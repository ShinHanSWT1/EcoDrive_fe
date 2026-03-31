
export const monthlyHistoryData = [
  { month: '10월', distance: 2450 },
  { month: '11월', distance: 2820 },
  { month: '12월', distance: 2100 },
  { month: '1월', distance: 2950 },
  { month: '2월', distance: 2506 },
  { month: '3월', distance: 2289 }, // Current Month
];

export const dailyHistoryData: Record<string, any> = {
  '일': { idling: '12분', avgSpeed: '42km/h', maxSpeed: '85km/h', accel: 1, decel: 2, start: 0, night: '15%', idlingTime: '12분' },
  '월': { idling: '8분', avgSpeed: '48km/h', maxSpeed: '92km/h', accel: 0, decel: 1, start: 1, night: '10%', idlingTime: '8분' },
  '화': { idling: '15분', avgSpeed: '38km/h', maxSpeed: '78km/h', accel: 3, decel: 4, start: 2, night: '25%', idlingTime: '15분' },
  '수': { idling: '10분', avgSpeed: '45km/h', maxSpeed: '88km/h', accel: 1, decel: 1, start: 0, night: '5%', idlingTime: '10분' },
  '목': { idling: '22분', avgSpeed: '35km/h', maxSpeed: '82km/h', accel: 2, decel: 3, start: 1, night: '30%', idlingTime: '22분' },
  '금': { idling: '45분', avgSpeed: '52km/h', maxSpeed: '110km/h', accel: 5, decel: 6, start: 3, night: '45%', idlingTime: '45분' },
  '토': { idling: '32분', avgSpeed: '40km/h', maxSpeed: '95km/h', accel: 2, decel: 2, start: 1, night: '20%', idlingTime: '32분' },
};

export const scoreTrendData = [
  { date: '03.20', score: 82 },
  { date: '03.21', score: 85 },
  { date: '03.22', score: 84 },
  { date: '03.23', score: 88 },
  { date: '03.24', score: 92 },
  { date: '03.25', score: 89 },
  { date: '03.26', score: 91 }, // Current
];

export const scoreHistoryData = [
  { id: 1, type: 'up', change: 2, reason: '3일 연속 정속 주행 유지', date: '03.26' },
  { id: 2, type: 'down', change: 3, reason: '급감속 2회 발생 (시내 주행)', date: '03.25' },
  { id: 3, type: 'up', change: 4, reason: '심야 운전 비중 감소', date: '03.24' },
  { id: 4, type: 'up', change: 3, reason: '공회전 시간 15% 단축', date: '03.23' },
  { id: 5, type: 'down', change: 1, reason: '급가속 1회 감지', date: '03.22' },
  { id: 6, type: 'up', change: 3, reason: '주간 안전 운행 거리 달성', date: '03.21' },
  { id: 7, type: 'up', change: 2, reason: '경제 운전 구간 80% 초과', date: '03.20' },
  { id: 8, type: 'down', change: 4, reason: '과속 구간 주행 감지 (고속도로)', date: '03.19' },
  { id: 9, type: 'up', change: 1, reason: '부드러운 코너링 점수 향상', date: '03.18' },
  { id: 10, type: 'up', change: 2, reason: '연속 무사고 주행 500km 달성', date: '03.17' },
];
