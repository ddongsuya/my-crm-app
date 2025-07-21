import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { db, Company, Meeting, Task, User, UserRole } from './data';
import { randomUUID } from 'crypto';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Request, Response, NextFunction } from 'express';

// req.user 타입 확장
interface AuthRequest extends Request {
  user?: any;
}

const JWT_SECRET = 'your_jwt_secret_key'; // 실제 운영시 .env로 분리 권장

const app = express();
const PORT = 4000;

app.use(cors());
app.use(bodyParser.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Company 전체 조회
app.get('/api/companies', (req, res) => {
  res.json(db.companies);
});

// Company 단일 조회
app.get('/api/companies/:id', (req, res) => {
  const company = db.companies.find(c => c.id === req.params.id);
  if (!company) return res.status(404).json({ error: 'Not found' });
  res.json(company);
});

// Company 생성
app.post('/api/companies', (req, res) => {
  const company: Company = { ...req.body, id: randomUUID(), createdAt: new Date().toISOString() };
  db.companies.push(company);
  res.status(201).json(company);
});

// Company 수정
app.put('/api/companies/:id', (req, res) => {
  const idx = db.companies.findIndex(c => c.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  db.companies[idx] = { ...db.companies[idx], ...req.body };
  res.json(db.companies[idx]);
});

// Company 삭제
app.delete('/api/companies/:id', (req, res) => {
  const idx = db.companies.findIndex(c => c.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  db.companies.splice(idx, 1);
  res.status(204).end();
});

// Meeting 전체 조회
app.get('/api/meetings', (req, res) => {
  res.json(db.meetings);
});

// Meeting 단일 조회
app.get('/api/meetings/:id', (req, res) => {
  const meeting = db.meetings.find(m => m.id === req.params.id);
  if (!meeting) return res.status(404).json({ error: 'Not found' });
  res.json(meeting);
});

// Meeting 생성
app.post('/api/meetings', (req, res) => {
  const meeting: Meeting = { ...req.body, id: randomUUID() };
  db.meetings.push(meeting);
  res.status(201).json(meeting);
});

// Meeting 수정
app.put('/api/meetings/:id', (req, res) => {
  const idx = db.meetings.findIndex(m => m.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  db.meetings[idx] = { ...db.meetings[idx], ...req.body };
  res.json(db.meetings[idx]);
});

// Meeting 삭제
app.delete('/api/meetings/:id', (req, res) => {
  const idx = db.meetings.findIndex(m => m.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  db.meetings.splice(idx, 1);
  res.status(204).end();
});

// Task 전체 조회
app.get('/api/tasks', (req, res) => {
  res.json(db.tasks);
});

// Task 단일 조회
app.get('/api/tasks/:id', (req, res) => {
  const task = db.tasks.find(t => t.id === req.params.id);
  if (!task) return res.status(404).json({ error: 'Not found' });
  res.json(task);
});

// Task 생성
app.post('/api/tasks', (req, res) => {
  const task: Task = { ...req.body, id: randomUUID() };
  db.tasks.push(task);
  res.status(201).json(task);
});

// Task 수정
app.put('/api/tasks/:id', (req, res) => {
  const idx = db.tasks.findIndex(t => t.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  db.tasks[idx] = { ...db.tasks[idx], ...req.body };
  res.json(db.tasks[idx]);
});

// Task 삭제
app.delete('/api/tasks/:id', (req, res) => {
  const idx = db.tasks.findIndex(t => t.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  db.tasks.splice(idx, 1);
  res.status(204).end();
});

// 회원가입
app.post('/api/auth/register', async (req, res) => {
  const { username, password, role } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'username, password required' });
  if (db.users.find(u => u.username === username)) return res.status(409).json({ error: 'username already exists' });
  const passwordHash = await bcrypt.hash(password, 10);
  const user: User = {
    id: randomUUID(),
    username,
    passwordHash,
    role: role === 'admin' ? 'admin' : 'user',
    createdAt: new Date().toISOString(),
  };
  db.users.push(user);
  res.status(201).json({ id: user.id, username: user.username, role: user.role, createdAt: user.createdAt });
});

// 로그인
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  const user = db.users.find(u => u.username === username);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ userId: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: { id: user.id, username: user.username, role: user.role, createdAt: user.createdAt } });
});

// 내 정보 조회 (로그인 필요)
app.get('/api/auth/me', authenticateToken, (req: AuthRequest, res: Response) => {
  const user = db.users.find(u => u.id === req.user?.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ id: user.id, username: user.username, role: user.role, createdAt: user.createdAt });
});

// JWT 인증 미들웨어
function authenticateToken(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
}

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
}); 