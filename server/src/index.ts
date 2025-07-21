import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { db, Company, Meeting, Task } from './data';
import { randomUUID } from 'crypto';

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

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
}); 