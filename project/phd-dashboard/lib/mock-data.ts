// ── LELP Platform Mock Data ──────────────────────────────────────────────────

export const BEHAVIORS = [
  { code: 'RB-01', name: 'Helmet Non-Compliance',   severity: 'HIGH',     color: '#ef4444', count: 1842 },
  { code: 'RB-02', name: 'Phone Use While Riding',  severity: 'HIGH',     color: '#f97316', count: 1203 },
  { code: 'RB-03', name: 'Wrong-Way Riding',         severity: 'HIGH',     color: '#eab308', count:  731 },
  { code: 'RB-04', name: 'Lane Violation',           severity: 'MODERATE', color: '#84cc16', count:  614 },
  { code: 'RB-05', name: 'Red Light Running',        severity: 'MODERATE', color: '#22c55e', count:  548 },
  { code: 'RB-06', name: 'Double/Triple Riding',     severity: 'MODERATE', color: '#06b6d4', count:  490 },
  { code: 'RB-07', name: 'Pedestrian Conflict',      severity: 'HIGH',     color: '#3b82f6', count:  378 },
  { code: 'RB-08', name: 'Abrupt Stop in Flow',      severity: 'MODERATE', color: '#8b5cf6', count:  290 },
  { code: 'RB-09', name: 'Overloading',              severity: 'MODERATE', color: '#ec4899', count:  187 },
  { code: 'RB-10', name: 'Speeding in School Zone',  severity: 'HIGH',     color: '#f43f5e', count:  142 },
] as const

export const SCHOOLS = [
  { id: 's1', name: 'THPT Lê Quý Đôn',      district: 'District 3',  cameras: 4, students: 1820, submissions: 312, risk: 8.2, pilot: true  },
  { id: 's2', name: 'THPT Nguyễn Thị Minh Khai', district: 'District 3',  cameras: 3, students: 2100, submissions: 275, risk: 7.6, pilot: true  },
  { id: 's3', name: 'THPT Trần Phú',         district: 'Tân Bình',   cameras: 2, students: 1650, submissions: 198, risk: 6.9, pilot: true  },
  { id: 's4', name: 'THCS Nguyễn Du',        district: 'District 1',  cameras: 3, students: 980,  submissions: 143, risk: 5.4, pilot: true  },
  { id: 's5', name: 'THPT Gia Định',         district: 'Bình Thạnh', cameras: 2, students: 1430, submissions: 121, risk: 4.8, pilot: false },
  { id: 's6', name: 'THCS Nguyễn Huệ',      district: 'District 1',  cameras: 1, students: 760,  submissions:  89, risk: 4.2, pilot: false },
]

export const KPI = {
  totalDetections:   6425,
  detectionsDelta:   '+12.4%',
  activeSchools:        6,
  pendingReviews:      47,
  modelAccuracy:     0.847,
  submissionsToday:    89,
  hotspots:            14,
  studentsActive:    1240,
}

// 30-day trend — all 10 behavior classes
export const TREND_DATA = Array.from({ length: 30 }, (_, i) => {
  const date = new Date(2026, 2, 12 + i)
  return {
    date:    date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    'RB-01': Math.round(55 + Math.sin(i * 0.40) * 18 + Math.random() * 12),
    'RB-02': Math.round(38 + Math.sin(i * 0.30 + 1.0) * 12 + Math.random() * 8),
    'RB-03': Math.round(24 + Math.sin(i * 0.50 + 2.0) * 8  + Math.random() * 6),
    'RB-04': Math.round(20 + Math.sin(i * 0.45 + 1.5) * 7  + Math.random() * 5),
    'RB-05': Math.round(18 + Math.sin(i * 0.40 + 0.5) * 6  + Math.random() * 5),
    'RB-06': Math.round(16 + Math.sin(i * 0.35 + 2.5) * 5  + Math.random() * 4),
    'RB-07': Math.round(12 + Math.sin(i * 0.50 + 1.2) * 4  + Math.random() * 3),
    'RB-08': Math.round(10 + Math.sin(i * 0.40 + 3.0) * 3  + Math.random() * 3),
    'RB-09': Math.round( 6 + Math.sin(i * 0.30 + 0.8) * 2  + Math.random() * 2),
    'RB-10': Math.round( 5 + Math.sin(i * 0.45 + 1.8) * 2  + Math.random() * 1),
  }
})

// Hourly distribution
export const HOURLY_DATA = [
  { hour: '06:00', count: 28 }, { hour: '07:00', count: 142 }, { hour: '07:30', count: 218 },
  { hour: '08:00', count: 184 }, { hour: '09:00', count: 67 },  { hour: '10:00', count: 44 },
  { hour: '11:00', count: 38 }, { hour: '12:00', count: 56 },  { hour: '13:00', count: 91 },
  { hour: '14:00', count: 72 }, { hour: '15:00', count: 48 },  { hour: '16:00', count: 104 },
  { hour: '17:00', count: 196 }, { hour: '17:30', count: 234 }, { hour: '18:00', count: 178 },
  { hour: '19:00', count: 62 }, { hour: '20:00', count: 24 },
]

// School comparison
export const SCHOOL_COMPARISON = SCHOOLS.map(s => ({
  name: s.name.replace('THPT ', '').replace('THCS ', ''),
  helmet: Math.round(s.submissions * 0.38),
  phone:  Math.round(s.submissions * 0.23),
  wrongWay: Math.round(s.submissions * 0.14),
  redLight: Math.round(s.submissions * 0.12),
  other:  Math.round(s.submissions * 0.13),
}))

// Recent detections feed
export const RECENT_DETECTIONS = [
  { id: 'd1', behavior: 'RB-01', school: 'THPT Lê Quý Đôn',    confidence: 0.94, time: '2 min ago',  status: 'VALIDATED' },
  { id: 'd2', behavior: 'RB-02', school: 'THPT Trần Phú',       confidence: 0.87, time: '4 min ago',  status: 'PENDING' },
  { id: 'd3', behavior: 'RB-05', school: 'THCS Nguyễn Du',      confidence: 0.91, time: '7 min ago',  status: 'VALIDATED' },
  { id: 'd4', behavior: 'RB-03', school: 'THPT Lê Quý Đôn',    confidence: 0.78, time: '11 min ago', status: 'PENDING' },
  { id: 'd5', behavior: 'RB-01', school: 'THPT Nguyễn Thị Minh Khai', confidence: 0.96, time: '14 min ago', status: 'VALIDATED' },
  { id: 'd6', behavior: 'RB-06', school: 'THPT Gia Định',       confidence: 0.82, time: '18 min ago', status: 'FLAGGED' },
  { id: 'd7', behavior: 'RB-02', school: 'THCS Nguyễn Huệ',    confidence: 0.89, time: '22 min ago', status: 'VALIDATED' },
  { id: 'd8', behavior: 'RB-04', school: 'THPT Lê Quý Đôn',    confidence: 0.74, time: '26 min ago', status: 'REJECTED' },
]

// Submission review queue
export const REVIEW_QUEUE = [
  { id: 'sub-001', student: 'Nguyễn Văn An',   school: 'THPT Lê Quý Đôn',    behavior: 'RB-01', confidence: 0.94, userLabel: 'RB-01', submittedAt: '2026-04-11 07:42', status: 'PENDING',    points: 10 },
  { id: 'sub-002', student: 'Trần Thị Bình',   school: 'THPT Trần Phú',       behavior: 'RB-02', confidence: 0.87, userLabel: 'RB-02', submittedAt: '2026-04-11 07:38', status: 'PENDING',    points: 10 },
  { id: 'sub-003', student: 'Lê Minh Châu',    school: 'THCS Nguyễn Du',      behavior: 'RB-05', confidence: 0.72, userLabel: 'RB-03', submittedAt: '2026-04-11 07:31', status: 'PENDING',    points: 10 },
  { id: 'sub-004', student: 'Phạm Thị Dung',   school: 'THPT Nguyễn Thị Minh Khai', behavior: 'RB-01', confidence: 0.96, userLabel: 'RB-01', submittedAt: '2026-04-11 07:28', status: 'PENDING', points: 10 },
  { id: 'sub-005', student: 'Võ Hồng Đức',     school: 'THPT Lê Quý Đôn',    behavior: 'RB-03', confidence: 0.61, userLabel: 'RB-04', submittedAt: '2026-04-11 07:24', status: 'PENDING',    points: 10 },
  { id: 'sub-006', student: 'Nguyễn Thu Hà',   school: 'THPT Gia Định',       behavior: 'RB-06', confidence: 0.83, userLabel: 'RB-06', submittedAt: '2026-04-11 07:19', status: 'VALIDATED',  points: 10 },
  { id: 'sub-007', student: 'Đặng Văn Hoàng',  school: 'THCS Nguyễn Huệ',    behavior: 'RB-02', confidence: 0.91, userLabel: 'RB-02', submittedAt: '2026-04-11 07:14', status: 'VALIDATED',  points: 10 },
  { id: 'sub-008', student: 'Trương Thị Kim',  school: 'THPT Trần Phú',       behavior: 'RB-04', confidence: 0.54, userLabel: 'RB-01', submittedAt: '2026-04-11 07:08', status: 'REJECTED',   points:  0 },
]

// Leaderboard
export const LEADERBOARD = [
  { rank: 1,  name: 'Nguyễn Văn An',    school: 'THPT Lê Quý Đôn',    grade: '11A',  points: 1840, badges: 8, submissions: 142, trend: 'up'   },
  { rank: 2,  name: 'Trần Thị Bình',    school: 'THPT Nguyễn Thị Minh Khai', grade: '10B', points: 1720, badges: 7, submissions: 128, trend: 'up' },
  { rank: 3,  name: 'Lê Minh Châu',     school: 'THCS Nguyễn Du',      grade: '9A',   points: 1650, badges: 7, submissions: 121, trend: 'same' },
  { rank: 4,  name: 'Phạm Thị Dung',    school: 'THPT Trần Phú',       grade: '12C',  points: 1540, badges: 6, submissions: 113, trend: 'up'   },
  { rank: 5,  name: 'Võ Hồng Đức',      school: 'THPT Lê Quý Đôn',    grade: '10A',  points: 1430, badges: 6, submissions: 108, trend: 'down' },
  { rank: 6,  name: 'Nguyễn Thu Hà',    school: 'THPT Gia Định',       grade: '11B',  points: 1380, badges: 5, submissions:  99, trend: 'up'   },
  { rank: 7,  name: 'Đặng Văn Hoàng',   school: 'THCS Nguyễn Huệ',    grade: '8A',   points: 1240, badges: 5, submissions:  94, trend: 'down' },
  { rank: 8,  name: 'Trương Thị Kim',   school: 'THPT Trần Phú',       grade: '10D',  points: 1190, badges: 4, submissions:  88, trend: 'same' },
  { rank: 9,  name: 'Bùi Quốc Long',    school: 'THPT Nguyễn Thị Minh Khai', grade: '11A', points: 1140, badges: 4, submissions: 82, trend: 'up' },
  { rank: 10, name: 'Hồ Thị Mỹ',        school: 'THPT Lê Quý Đôn',    grade: '12B',  points: 1080, badges: 4, submissions:  79, trend: 'down' },
]

// School leaderboard
export const SCHOOL_LEADERBOARD = SCHOOLS.map((s, i) => ({
  rank: i + 1,
  ...s,
  totalPoints: Math.round(s.submissions * 11.4 - i * 180),
  avgScore: Math.round(82 - i * 3.2),
})).sort((a, b) => b.totalPoints - a.totalPoints).map((s, i) => ({ ...s, rank: i + 1 }))

// Quiz questions
export const QUIZ_QUESTIONS = [
  { id: 'q1',  behavior: 'RB-01', text: 'A rider without a helmet is spotted at the school gate. What is the immediate risk?',         difficulty: 'EASY',   active: true,  plays: 2840 },
  { id: 'q2',  behavior: 'RB-02', text: 'You see a student using their phone while riding through a school zone. What should you do?',    difficulty: 'EASY',   active: true,  plays: 2610 },
  { id: 'q3',  behavior: 'RB-03', text: 'A motorcycle enters the school street going the wrong direction. What is the primary hazard?',   difficulty: 'MEDIUM', active: true,  plays: 1980 },
  { id: 'q4',  behavior: 'RB-05', text: 'Identify the behavior shown: [image of vehicle crossing on red at school crossing]',              difficulty: 'MEDIUM', active: true,  plays: 1840 },
  { id: 'q5',  behavior: 'RB-01', text: 'In Vietnam, from what age is wearing a helmet legally mandatory on all roads?',                    difficulty: 'EASY',   active: true,  plays: 1720 },
  { id: 'q6',  behavior: 'RB-06', text: 'Three students are riding on a single motorcycle. What is the legal and safety concern?',         difficulty: 'EASY',   active: true,  plays: 1650 },
  { id: 'q7',  behavior: 'RB-04', text: 'A student crosses the solid white line to overtake in front of the school gate. Rate the risk.',   difficulty: 'HARD',   active: true,  plays: 1480 },
  { id: 'q8',  behavior: 'RB-07', text: 'A pedestrian steps onto the crossing. The approaching rider does not slow down. Assess the situation.', difficulty: 'HARD', active: false, plays: 1320 },
]

// Hotspot locations — 30 real HCMC school zones spanning full city
// Coordinates verified from OSM/Google Maps for HCMC school locations
export const HOTSPOTS = [
  // ── District 1 ─────────────────────────────────────────────────────────────
  { id: 'h01', lat: 10.7769, lng: 106.7009, school: 'THPT Lê Quý Đôn',             risk: 8.2, count: 312, behavior: 'RB-01' },
  { id: 'h02', lat: 10.7795, lng: 106.6987, school: 'THCS Nguyễn Du',               risk: 5.4, count: 143, behavior: 'RB-03' },
  { id: 'h03', lat: 10.7762, lng: 106.6993, school: 'THCS Nguyễn Huệ',             risk: 4.2, count:  89, behavior: 'RB-06' },
  // ── District 3 ─────────────────────────────────────────────────────────────
  { id: 'h04', lat: 10.7784, lng: 106.6982, school: 'THPT Nguyễn Thị Minh Khai',   risk: 7.6, count: 275, behavior: 'RB-02' },
  { id: 'h05', lat: 10.7748, lng: 106.6873, school: 'THPT Marie Curie',             risk: 7.1, count: 243, behavior: 'RB-01' },
  { id: 'h06', lat: 10.7756, lng: 106.6912, school: 'THCS Colette',                 risk: 5.8, count: 178, behavior: 'RB-04' },
  // ── District 5 ─────────────────────────────────────────────────────────────
  { id: 'h07', lat: 10.7548, lng: 106.6641, school: 'THPT Trần Khai Nguyên',        risk: 6.3, count: 201, behavior: 'RB-02' },
  { id: 'h08', lat: 10.7521, lng: 106.6604, school: 'THCS Nguyễn Trãi',             risk: 5.1, count: 154, behavior: 'RB-01' },
  { id: 'h09', lat: 10.7505, lng: 106.6657, school: 'THPT Lê Hồng Phong',           risk: 7.8, count: 289, behavior: 'RB-03' },
  // ── District 6 ─────────────────────────────────────────────────────────────
  { id: 'h10', lat: 10.7479, lng: 106.6347, school: 'THPT Bình Phú',                risk: 5.7, count: 167, behavior: 'RB-05' },
  { id: 'h11', lat: 10.7432, lng: 106.6390, school: 'THCS Tân Hưng',                risk: 4.5, count: 112, behavior: 'RB-06' },
  // ── District 7 ─────────────────────────────────────────────────────────────
  { id: 'h12', lat: 10.7323, lng: 106.7165, school: 'THPT Tân Phong',               risk: 4.9, count: 138, behavior: 'RB-01' },
  { id: 'h13', lat: 10.7269, lng: 106.7215, school: 'THCS Nguyễn Hữu Thọ',          risk: 3.8, count:  96, behavior: 'RB-05' },
  // ── District 8 ─────────────────────────────────────────────────────────────
  { id: 'h14', lat: 10.7395, lng: 106.6518, school: 'THPT Nguyễn Hữu Cảnh',         risk: 6.1, count: 185, behavior: 'RB-02' },
  { id: 'h15', lat: 10.7351, lng: 106.6470, school: 'THCS Lê Văn Thịnh',            risk: 5.3, count: 148, behavior: 'RB-04' },
  // ── District 10 ────────────────────────────────────────────────────────────
  { id: 'h16', lat: 10.7736, lng: 106.6689, school: 'THPT Nguyễn An Ninh',          risk: 6.8, count: 219, behavior: 'RB-01' },
  { id: 'h17', lat: 10.7712, lng: 106.6651, school: 'THCS Lê Quý Đôn Q10',         risk: 5.6, count: 162, behavior: 'RB-03' },
  // ── Tân Bình ───────────────────────────────────────────────────────────────
  { id: 'h18', lat: 10.7921, lng: 106.6556, school: 'THPT Trần Phú',                risk: 6.9, count: 198, behavior: 'RB-01' },
  { id: 'h19', lat: 10.7965, lng: 106.6502, school: 'THPT Nguyễn Chí Thanh',        risk: 5.9, count: 172, behavior: 'RB-02' },
  { id: 'h20', lat: 10.7882, lng: 106.6439, school: 'THCS Nguyễn Bỉnh Khiêm',      risk: 4.6, count: 128, behavior: 'RB-06' },
  // ── Bình Thạnh ─────────────────────────────────────────────────────────────
  { id: 'h21', lat: 10.8136, lng: 106.7081, school: 'THPT Gia Định',                risk: 4.8, count: 121, behavior: 'RB-05' },
  { id: 'h22', lat: 10.8178, lng: 106.7024, school: 'THPT Bình Thạnh',              risk: 5.5, count: 158, behavior: 'RB-01' },
  { id: 'h23', lat: 10.8097, lng: 106.7142, school: 'THCS Hoa Lư',                  risk: 4.3, count: 103, behavior: 'RB-04' },
  // ── Phú Nhuận ──────────────────────────────────────────────────────────────
  { id: 'h24', lat: 10.7990, lng: 106.6842, school: 'THPT Phú Nhuận',               risk: 5.2, count: 149, behavior: 'RB-02' },
  { id: 'h25', lat: 10.8015, lng: 106.6798, school: 'THCS Lê Văn Sỹ',              risk: 4.7, count: 118, behavior: 'RB-05' },
  // ── Gò Vấp ─────────────────────────────────────────────────────────────────
  { id: 'h26', lat: 10.8352, lng: 106.6684, school: 'THPT Gò Vấp',                  risk: 6.4, count: 207, behavior: 'RB-01' },
  { id: 'h27', lat: 10.8291, lng: 106.6741, school: 'THPT Nguyễn Công Trứ',         risk: 5.8, count: 175, behavior: 'RB-03' },
  { id: 'h28', lat: 10.8418, lng: 106.6628, school: 'THCS Lý Tự Trọng',             risk: 4.1, count:  94, behavior: 'RB-06' },
  // ── Thủ Đức / TP Thủ Đức ───────────────────────────────────────────────────
  { id: 'h29', lat: 10.8481, lng: 106.7542, school: 'THPT Thủ Đức',                 risk: 5.3, count: 152, behavior: 'RB-02' },
  { id: 'h30', lat: 10.8535, lng: 106.7612, school: 'THPT Linh Trung',              risk: 4.4, count: 109, behavior: 'RB-01' },
]

export const getBehaviorByCode = (code: string) =>
  BEHAVIORS.find(b => b.code === code) ?? BEHAVIORS[0]
