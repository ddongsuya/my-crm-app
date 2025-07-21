import React, { useState, useEffect, useCallback, ReactNode, ReactElement } from 'react';
import { Company, Meeting, Task, TaskStatus, View, NotificationItem, Contact, Quotation, Contract, Study } from './types';
import {
  Button, Card, Input, Textarea, Select, Modal, CompanyForm, MeetingForm, TaskForm, GanttChartRenderer, StatCard, UpcomingItemCard, QuotationForm, ContractForm
} from './components';
import {
  PlusIcon, TrashIcon, PencilIcon, BellIcon, DashboardIcon, ClientsIcon, ChevronDownIcon, CalendarDaysIcon, ListBulletIcon, ChartBarIcon, UserCircleIcon, EnvelopeIcon, PhoneIcon, MapPinIcon, InformationCircleIcon, ClipboardDocumentListIcon, BeakerIcon, CalendarModernIcon, ChevronLeftIcon, ChevronRightIcon, ChartPieIcon, ArrowDownTrayIcon, XMarkIcon, Bars3Icon
} from './icons';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

// API 클라이언트 함수들
const api = {
  companies: {
    getAll: async (): Promise<Company[]> => {
      const response = await fetch('http://localhost:4000/api/companies');
      return response.json();
    },
    create: async (company: Omit<Company, 'id' | 'createdAt'>): Promise<Company> => {
      const response = await fetch('http://localhost:4000/api/companies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(company)
      });
      return response.json();
    },
    update: async (id: string, company: Partial<Company>): Promise<Company> => {
      const response = await fetch(`http://localhost:4000/api/companies/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(company)
      });
      return response.json();
    },
    delete: async (id: string): Promise<void> => {
      await fetch(`http://localhost:4000/api/companies/${id}`, {
        method: 'DELETE'
      });
    }
  },
  meetings: {
    getAll: async (): Promise<Meeting[]> => {
      const response = await fetch('http://localhost:4000/api/meetings');
      return response.json();
    },
    create: async (meeting: Omit<Meeting, 'id'>): Promise<Meeting> => {
      const response = await fetch('http://localhost:4000/api/meetings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(meeting)
      });
      return response.json();
    },
    update: async (id: string, meeting: Partial<Meeting>): Promise<Meeting> => {
      const response = await fetch(`http://localhost:4000/api/meetings/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(meeting)
      });
      return response.json();
    },
    delete: async (id: string): Promise<void> => {
      await fetch(`http://localhost:4000/api/meetings/${id}`, {
        method: 'DELETE'
      });
    }
  },
  tasks: {
    getAll: async (): Promise<Task[]> => {
      const response = await fetch('http://localhost:4000/api/tasks');
      return response.json();
    },
    create: async (task: Omit<Task, 'id'>): Promise<Task> => {
      const response = await fetch('http://localhost:4000/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task)
      });
      return response.json();
    },
    update: async (id: string, task: Partial<Task>): Promise<Task> => {
      const response = await fetch(`http://localhost:4000/api/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task)
      });
      return response.json();
    },
    delete: async (id: string): Promise<void> => {
      await fetch(`http://localhost:4000/api/tasks/${id}`, {
        method: 'DELETE'
      });
    }
  },
  quotations: {
    create: async (quotation: Omit<Quotation, 'id'>): Promise<Quotation> => {
      const response = await fetch('http://localhost:4000/api/quotations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quotation)
      });
      return response.json();
    },
    update: async (id: string, quotation: Partial<Quotation>): Promise<Quotation> => {
      const response = await fetch(`http://localhost:4000/api/quotations/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quotation)
      });
      return response.json();
    },
    delete: async (id: string): Promise<void> => {
      await fetch(`http://localhost:4000/api/quotations/${id}`, {
        method: 'DELETE'
      });
    }
  },
  contracts: {
    create: async (contract: Omit<Contract, 'id'>): Promise<Contract> => {
      const response = await fetch('http://localhost:4000/api/contracts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contract)
      });
      return response.json();
    },
    update: async (id: string, contract: Partial<Contract>): Promise<Contract> => {
      const response = await fetch(`http://localhost:4000/api/contracts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contract)
      });
      return response.json();
    },
    delete: async (id: string): Promise<void> => {
      await fetch(`http://localhost:4000/api/contracts/${id}`, {
        method: 'DELETE'
      });
    }
  }
};

// App 컴포넌트 내 상단에 추가
const isValidDate = (d?: string) => !!d && !isNaN(new Date(d).getTime());

function App() {
  const [view, setView] = useState<View>({ type: 'dashboard' });
  const [companies, setCompanies] = useState<Company[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [showNotificationPanel, setShowNotificationPanel] = useState(false);

  // 모달 상태들
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [showQuotationModal, setShowQuotationModal] = useState(false);
  const [showContractModal, setShowContractModal] = useState(false);
  const [showStudyModal, setShowStudyModal] = useState(false);

  // 편집할 항목들
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [editingMeeting, setEditingMeeting] = useState<Meeting | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editingQuotation, setEditingQuotation] = useState<Quotation | null>(null);
  const [editingContract, setEditingContract] = useState<Contract | null>(null);
  const [editingStudy, setEditingStudy] = useState<Study | null>(null);

  // App 컴포넌트 최상단에 상태/함수 선언
  const [clientDetailTab, setClientDetailTab] = useState<'overview' | 'meetings' | 'tasks' | 'financials' | 'studies' | 'notes'>('overview');
  const [calendarCurrentDate, setCalendarCurrentDate] = useState(() => {
    const d = new Date();
    d.setDate(1);
    d.setHours(0, 0, 0, 0);
    return d;
  });
  const [calendarSelectedDate, setCalendarSelectedDate] = useState<Date | null>(null);
  const [calendarShowDayModal, setCalendarShowDayModal] = useState(false);

  // App 컴포넌트 최상단에 추가:
  const [clientListSearch, setClientListSearch] = useState('');
  const [clientListSortKey, setClientListSortKey] = useState<'name' | 'createdAt'>('name');
  const [clientListSortAsc, setClientListSortAsc] = useState(true);

  // App 컴포넌트 내 useState 추가
  const [showOngoingContracts, setShowOngoingContracts] = useState(false);
  const [showCompletedContracts, setShowCompletedContracts] = useState(false);
  const [showInvoiceContracts, setShowInvoiceContracts] = useState(false);

  // 1. App 컴포넌트 최상단에 추가 (기존 useState들과 함께)
  const [notesDraft, setNotesDraft] = useState('');
  const [notesSaved, setNotesSaved] = useState(false);

  // 데이터 로딩
  const loadData = useCallback(async () => {
    try {
      const [companiesData, meetingsData, tasksData] = await Promise.all([
        api.companies.getAll(),
        api.meetings.getAll(),
        api.tasks.getAll()
      ]);
      setCompanies(companiesData);
      setMeetings(meetingsData);
      setTasks(tasksData);
    } catch (error) {
      console.error('데이터 로딩 실패:', error);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // 회사 관리
  const handleCreateCompany = async (companyData: Omit<Company, 'id' | 'createdAt'>) => {
    await api.companies.create(companyData);
    setView({ type: 'clientList' });
  };

  const handleUpdateCompany = async (id: string, companyData: Partial<Company>) => {
    try {
      const updatedCompany = await api.companies.update(id, companyData);
      setCompanies(prev => prev.map(c => c.id === id ? updatedCompany : c));
      setShowCompanyModal(false);
      setEditingCompany(null);
    } catch (error) {
      console.error('회사 수정 실패:', error);
    }
  };

  const handleDeleteCompany = async (id: string) => {
    try {
      await api.companies.delete(id);
      setCompanies(prev => prev.filter(c => c.id !== id));
    } catch (error) {
      console.error('회사 삭제 실패:', error);
    }
  };

  // 미팅 관리
  const handleCreateMeeting = async (meetingData: Omit<Meeting, 'id'>) => {
    try {
      const newMeeting = await api.meetings.create(meetingData);
      setMeetings(prev => [...prev, newMeeting]);
      setShowMeetingModal(false);
    } catch (error) {
      console.error('미팅 생성 실패:', error);
    }
  };

  const handleUpdateMeeting = async (id: string, meetingData: Partial<Meeting>) => {
    try {
      const updatedMeeting = await api.meetings.update(id, meetingData);
      setMeetings(prev => prev.map(m => m.id === id ? updatedMeeting : m));
      setShowMeetingModal(false);
      setEditingMeeting(null);
    } catch (error) {
      console.error('미팅 수정 실패:', error);
    }
  };

  const handleDeleteMeeting = async (id: string) => {
    try {
      await api.meetings.delete(id);
      setMeetings(prev => prev.filter(m => m.id !== id));
    } catch (error) {
      console.error('미팅 삭제 실패:', error);
    }
  };

  // 태스크 관리
  const handleCreateTask = async (taskData: Omit<Task, 'id'>) => {
    try {
      const newTask = await api.tasks.create(taskData);
      setTasks(prev => [...prev, newTask]);
      setShowTaskModal(false);
    } catch (error) {
      console.error('태스크 생성 실패:', error);
    }
  };

  const handleUpdateTask = async (id: string, taskData: Partial<Task>) => {
    try {
      const updatedTask = await api.tasks.update(id, taskData);
      setTasks(prev => prev.map(t => t.id === id ? updatedTask : t));
      setShowTaskModal(false);
      setEditingTask(null);
    } catch (error) {
      console.error('태스크 수정 실패:', error);
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await api.tasks.delete(id);
      setTasks(prev => prev.filter(t => t.id !== id));
    } catch (error) {
      console.error('태스크 삭제 실패:', error);
    }
  };

  // 태스크 마감 초과 알림 자동 생성
  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const overdueTasks = tasks.filter(
      t => t.status !== TaskStatus.Completed && new Date(t.endDate) < today
    );
    setNotifications(prev => {
      // 기존 overdue 알림 유지, 새 overdue 태스크에 대해 알림 추가
      const existingIds = new Set(
        prev
          .filter(n => n.type === 'warning' && n.message.includes('마감') && typeof n.relatedId === 'string')
          .map(n => n.relatedId as string)
      );
      const newNotis = overdueTasks
        .filter(t => !existingIds.has(t.id))
        .map(t => ({
          id: `${t.id}-overdue`,
          message: `태스크 "${t.name}" 마감일이 지났습니다.`,
          type: 'warning' as const,
          relatedId: t.id,
          isRead: false,
          createdAt: new Date().toISOString()
        }));
      // 기존 overdue 알림 중 더 이상 overdue가 아닌 것은 제거
      const stillOverdueIds = new Set(overdueTasks.map(t => t.id));
      const filteredPrev = prev.filter(
        n => n.type !== 'warning' || !n.message.includes('마감') || (typeof n.relatedId === 'string' && stillOverdueIds.has(n.relatedId))
      );
      return [...filteredPrev, ...newNotis];
    });
  }, [tasks]);

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  // 대시보드 렌더링
  const renderDashboard = () => {
    // 다가오는 태스크(마감일 기준 오름차순, 미완료, 5개)
    const upcomingTasks = tasks
      .filter(t => t.status !== TaskStatus.Completed && new Date(t.endDate) >= new Date())
      .sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime())
      .slice(0, 5);
    // 지연 태스크(마감일 지남, 미완료, 5개)
    const overdueTasks = tasks
      .filter(t => t.status !== TaskStatus.Completed && new Date(t.endDate) < new Date())
      .sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime())
      .slice(0, 5);
    // 다가오는 미팅(날짜 기준 오름차순, 5개)
    const upcomingMeetings = meetings
      .filter(m => new Date(m.date) >= new Date())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 5);

    // 통계 계산
    const totalCompanies = companies.length;
    const activeTasks = tasks.filter(t => t.status === TaskStatus.InProgress).length;
    const completedTasks = tasks.filter(t => t.status === TaskStatus.Completed).length;
    const totalRevenue = companies.reduce((sum, c) => {
      const contractsRevenue = c.contracts?.reduce((contractSum, contract) =>
        contractSum + parseFloat(contract.contractAmount.replace(/[^0-9.-]/g, '') || '0'), 0) || 0;
      return sum + contractsRevenue;
    }, 0);

    // Recent Activity - 최근 활동 내역 (최근 10개)
    const recentActivities = [
      ...tasks.map(task => ({
        type: 'task' as const,
        item: task,
        date: task.endDate,
        company: companies.find(c => c.id === task.companyId)
      })),
      ...meetings.map(meeting => ({
        type: 'meeting' as const,
        item: meeting,
        date: meeting.date,
        company: companies.find(c => c.id === meeting.companyId)
      })),
      ...companies.map(company => ({
        type: 'company' as const,
        item: company,
        date: company.createdAt,
        company: company
      }))
    ]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10);

    return (
      <div className="space-y-6">
        {/* 통계 카드들 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Companies"
            value={totalCompanies}
            trend="+12%"
            trendDirection="up"
            icon={<UserCircleIcon className="w-6 h-6" />}
          />
          <StatCard
            title="Active Tasks"
            value={activeTasks}
            trend="+5%"
            trendDirection="up"
            icon={<ListBulletIcon className="w-6 h-6" />}
          />
          <StatCard
            title="Completed Tasks"
            value={completedTasks}
            trend="+8%"
            trendDirection="up"
            icon={<ClipboardDocumentListIcon className="w-6 h-6" />}
          />
          <StatCard
            title="Total Revenue"
            value={`$${totalRevenue.toLocaleString()}`}
            trend="+15%"
            trendDirection="up"
            icon={<ChartBarIcon className="w-6 h-6" />}
          />
        </div>

        {/* Gantt 차트 섹션 */}
        <Card className="p-6 flex flex-col lg:flex-row gap-6">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold mb-4">Recent Tasks Overview</h3>
            <GanttChartRenderer
              tasks={tasks.slice(0, 15)}
              companies={companies}
              onTaskClick={(task) => setEditingTask(task)}
            />
          </div>
          <div className="flex flex-col gap-4 w-full lg:w-64">
            {/* 진행중 계약 */}
            <Card className="p-4 cursor-pointer" onClick={() => setShowOngoingContracts(true)}>
              <h3 className="font-semibold mb-2 flex items-center"><ClipboardDocumentListIcon className="w-4 h-4 mr-2" />진행중 계약</h3>
              <div className="text-2xl font-bold mb-2">{(() => {
                const now = new Date();
                return companies.flatMap(c => c.contracts || []).filter(ct => isValidDate(ct.contractPeriodStart) && isValidDate(ct.contractPeriodEnd) && new Date(ct.contractPeriodStart!) <= now && new Date(ct.contractPeriodEnd!) >= now).length;
              })()}건</div>
              <ul className="text-xs text-gray-600 space-y-1">
                {companies.flatMap(c => (c.contracts || []).map(ct => ({ ...ct, companyName: c.name }))).filter(ct => isValidDate(ct.contractPeriodStart) && isValidDate(ct.contractPeriodEnd) && new Date(ct.contractPeriodStart!) <= new Date() && new Date(ct.contractPeriodEnd!) >= new Date()).slice(0, 5).map(ct => (
                  <li key={ct.id}>{ct.companyName} - {ct.contractName} ({ct.contractPeriodStart}~{ct.contractPeriodEnd})</li>
                ))}
              </ul>
            </Card>
            {/* 완료된 계약 */}
            <Card className="p-4 cursor-pointer" onClick={() => setShowCompletedContracts(true)}>
              <h3 className="font-semibold mb-2 flex items-center"><ClipboardDocumentListIcon className="w-4 h-4 mr-2 text-gray-400" />완료된 계약</h3>
              <div className="text-2xl font-bold mb-2">{(() => {
                const now = new Date();
                return companies.flatMap(c => c.contracts || []).filter(ct => isValidDate(ct.contractPeriodEnd) && new Date(ct.contractPeriodEnd!) < now).length;
              })()}건</div>
              <ul className="text-xs text-gray-600 space-y-1">
                {companies.flatMap(c => (c.contracts || []).map(ct => ({ ...ct, companyName: c.name }))).filter(ct => isValidDate(ct.contractPeriodEnd) && new Date(ct.contractPeriodEnd!) < new Date()).slice(0, 5).map(ct => (
                  <li key={ct.id}>{ct.companyName} - {ct.contractName} ({ct.contractPeriodStart}~{ct.contractPeriodEnd})</li>
                ))}
              </ul>
            </Card>
            {/* 세금계산서 발행 예정 */}
            <Card className="p-4 cursor-pointer" onClick={() => setShowInvoiceContracts(true)}>
              <h3 className="font-semibold mb-2 flex items-center"><ClipboardDocumentListIcon className="w-4 h-4 mr-2 text-blue-500" />세금계산서 발행 예정</h3>
              <div className="text-2xl font-bold mb-2">{(() => {
                const now = new Date();
                const week = new Date(); week.setDate(now.getDate() + 7);
                return companies.flatMap(c => (c.contracts || []).map(ct => ({ ...ct, companyName: c.name }))).filter(ct => isValidDate(ct.contractSigningDate) && (() => { const d = new Date(ct.contractSigningDate!); d.setDate(d.getDate() + 30); return d >= now && d <= week; })()).length;
              })()}건</div>
              <ul className="text-xs text-gray-600 space-y-1">
                {companies.flatMap(c => (c.contracts || []).map(ct => ({ ...ct, companyName: c.name }))).filter(ct => isValidDate(ct.contractSigningDate) && (() => { const d = new Date(ct.contractSigningDate!); d.setDate(d.getDate() + 30); return d >= new Date() && d <= (() => { const w = new Date(); w.setDate(w.getDate() + 7); return w; })(); })()).slice(0, 5).map(ct => {
                  let d: Date | null = null;
                  if (isValidDate(ct.contractSigningDate)) {
                    d = new Date(ct.contractSigningDate!);
                    d.setDate(d.getDate() + 30);
                  }
                  return <li key={ct.id}>{ct.companyName} - {ct.contractName} (발행예정: {d ? d.toISOString().slice(0, 10) : '-'})</li>;
                })}
              </ul>
            </Card>
          </div>
        </Card>

        {/* 주요 일정 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Upcoming Tasks */}
          <Card className="p-4">
            <h3 className="font-semibold mb-2 flex items-center"><ListBulletIcon className="w-4 h-4 mr-2" />Upcoming Tasks</h3>
            {upcomingTasks.length === 0 ? (
              <p className="text-sm text-gray-500">No upcoming tasks.</p>
            ) : (
              <div className="space-y-2">
                {upcomingTasks.map(task => (
                  <UpcomingItemCard
                    key={task.id}
                    item={task}
                    type="task"
                    companyName={companies.find(c => c.id === task.companyId)?.name}
                    onClick={() => setEditingTask(task)}
                  />
                ))}
              </div>
            )}
          </Card>
          {/* Overdue Tasks */}
          <Card className="p-4">
            <h3 className="font-semibold mb-2 flex items-center"><TrashIcon className="w-4 h-4 mr-2 text-red-500" />Overdue Tasks</h3>
            {overdueTasks.length === 0 ? (
              <p className="text-sm text-gray-500">No overdue tasks.</p>
            ) : (
              <div className="space-y-2">
                {overdueTasks.map(task => (
                  <UpcomingItemCard
                    key={task.id}
                    item={task}
                    type="task"
                    companyName={companies.find(c => c.id === task.companyId)?.name}
                    onClick={() => setEditingTask(task)}
                  />
                ))}
              </div>
            )}
          </Card>
          {/* Upcoming Meetings */}
          <Card className="p-4">
            <h3 className="font-semibold mb-2 flex items-center"><CalendarDaysIcon className="w-4 h-4 mr-2" />Upcoming Meetings</h3>
            {upcomingMeetings.length === 0 ? (
              <p className="text-sm text-gray-500">No upcoming meetings.</p>
            ) : (
              <div className="space-y-2">
                {upcomingMeetings.map(meeting => {
                  const companyObj = companies.find(c => c.id === meeting.companyId);
                  const contactName = companyObj?.contacts.find((ct: Contact) => ct.id === meeting.contactId)?.name;
                  return (
                    <UpcomingItemCard
                      key={meeting.id}
                      item={meeting}
                      type="meeting"
                      companyName={companyObj?.name}
                      contactName={contactName}
                      onClick={() => setEditingMeeting(meeting)}
                    />
                  );
                })}
              </div>
            )}
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {recentActivities.length === 0 ? (
              <p className="text-sm text-gray-500">No recent activity.</p>
            ) : (
              recentActivities.map((activity, index) => {
                const getActivityIcon = () => {
                  switch (activity.type) {
                    case 'task':
                      return <ClipboardDocumentListIcon className="w-4 h-4" />;
                    case 'meeting':
                      return <CalendarDaysIcon className="w-4 h-4" />;
                    case 'company':
                      return <UserCircleIcon className="w-4 h-4" />;
                    default:
                      return <InformationCircleIcon className="w-4 h-4" />;
                  }
                };

                const getActivityText = () => {
                  switch (activity.type) {
                    case 'task':
                      const task = activity.item as Task;
                      return `${task.name} - ${task.status}`;
                    case 'meeting':
                      const meeting = activity.item as Meeting;
                      return `${meeting.title}`;
                    case 'company':
                      const company = activity.item as Company;
                      return `Company ${company.name} added`;
                    default:
                      return 'Activity';
                  }
                };

                const handleClick = () => {
                  switch (activity.type) {
                    case 'task':
                      setEditingTask(activity.item as Task);
                      break;
                    case 'meeting':
                      setEditingMeeting(activity.item as Meeting);
                      break;
                    case 'company':
                      setView({ type: 'clientDetail', clientId: activity.item.id });
                      break;
                  }
                };

                return (
                  <div
                    key={`${activity.type}-${activity.item.id}-${index}`}
                    className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                    onClick={handleClick}
                  >
                    <div className="text-gray-500">
                      {getActivityIcon()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {getActivityText()}
                      </p>
                      <p className="text-xs text-gray-500">
                        {activity.company?.name} • {new Date(activity.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </Card>
      </div>
    );
  };

  // 고객사 목록 렌더링
  const renderClientList = (
    search: string,
    setSearch: React.Dispatch<React.SetStateAction<string>>,
    sortKey: 'name' | 'createdAt',
    setSortKey: React.Dispatch<React.SetStateAction<'name' | 'createdAt'>>,
    sortAsc: boolean,
    setSortAsc: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    const filteredCompanies = companies
      .filter(c => c.name.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => {
        if (sortKey === 'name') {
          return sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
        } else {
          return sortAsc ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime() : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
      });

    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex gap-2 items-center">
            <Input
              placeholder="고객사명 검색"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-48"
            />
            <Select value={sortKey} onChange={e => setSortKey(e.target.value as 'name' | 'createdAt')} className="w-32">
              <option value="name">이름순</option>
              <option value="createdAt">등록일순</option>
            </Select>
            <Button variant="ghost" size="sm" onClick={() => setSortAsc(v => !v)}>
              {sortAsc ? '▲' : '▼'}
            </Button>
          </div>
          <Button variant="primary" onClick={() => setView({ type: 'clientDetail', clientId: '' })}>
            <PlusIcon className="w-4 h-4 mr-1" /> 신규 고객사 등록
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded-lg shadow-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-700 text-sm">
                <th className="px-4 py-2 text-left">회사명</th>
                <th className="px-4 py-2 text-left">대표 연락처</th>
                <th className="px-4 py-2 text-left">담당자</th>
                <th className="px-4 py-2 text-left">계약</th>
                <th className="px-4 py-2 text-left">견적</th>
                <th className="px-4 py-2 text-left">연구</th>
                <th className="px-4 py-2 text-left">등록일</th>
                <th className="px-4 py-2 text-center">관리</th>
              </tr>
            </thead>
            <tbody>
              {filteredCompanies.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center text-gray-400 py-8">검색 결과가 없습니다.</td>
                </tr>
              ) : (
                filteredCompanies.map(company => (
                  <tr
                    key={company.id}
                    className="hover:bg-blue-50 transition cursor-pointer"
                    onClick={() => setView({ type: 'clientDetail', clientId: company.id })}
                  >
                    <td className="px-4 py-2 font-medium whitespace-nowrap">{company.name}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{company.mainPhoneNumber || '-'}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{company.contacts.find(c => c.isPrimary)?.name || (company.contacts[0]?.name ?? '-')}</td>
                    <td className="px-4 py-2 text-center">{company.contracts?.length ?? 0}</td>
                    <td className="px-4 py-2 text-center">{company.quotations?.length ?? 0}</td>
                    <td className="px-4 py-2 text-center">{company.studies?.length ?? 0}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{new Date(company.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-2 text-center">
                      <div className="flex gap-2 justify-center" onClick={e => e.stopPropagation()}>
                        <Button variant="ghost" size="sm" onClick={() => setView({ type: 'clientDetail', clientId: company.id })}>
                          <PencilIcon className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteCompany(company.id)}>
                          <TrashIcon className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // 고객사 상세 렌더링
  const renderClientDetail = (
    tab: 'overview' | 'meetings' | 'tasks' | 'financials' | 'studies' | 'notes',
    setTab: React.Dispatch<React.SetStateAction<'overview' | 'meetings' | 'tasks' | 'financials' | 'studies' | 'notes'>>
  ) => {
    if (view.type !== 'clientDetail') return <div className="p-8 text-gray-400">고객사를 선택하세요.</div>;
    if (!view.clientId) {
      // 신규 등록 모드
      return (
        <Card className="p-6 max-w-xl mx-auto">
          <h2 className="text-xl font-bold mb-4">신규 고객사 등록</h2>
          <CompanyForm
            onSubmit={handleCreateCompany}
            onCancel={() => setView({ type: 'clientList' })}
          />
        </Card>
      );
    }
    const company = companies.find(c => c.id === view.clientId);
    if (!company) return <div className="p-8 text-gray-400">고객사 정보를 찾을 수 없습니다.</div>;

    const tabs = [
      { key: 'overview', label: 'Overview' },
      { key: 'meetings', label: 'Meetings' },
      { key: 'tasks', label: 'Schedule & Tasks' },
      { key: 'financials', label: 'Financials' },
      { key: 'studies', label: 'Studies' },
      { key: 'notes', label: 'Notes' }
    ];

    // Notes 탭 구현
    const notesDraft = notesDraftMap[company.id] ?? company.notes ?? '';
    const notesSaved = notesSavedMap[company.id] ?? false;
    const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setNotesDraftMap(prev => ({ ...prev, [company.id]: e.target.value }));
    };
    const handleNotesSave = (e: React.FormEvent) => {
      e.preventDefault();
      handleUpdateCompany(company.id, { notes: notesDraft });
      setNotesSavedMap(prev => ({ ...prev, [company.id]: true }));
      setTimeout(() => setNotesSavedMap(prev => ({ ...prev, [company.id]: false })), 1500);
    };

    return (
      <div className="space-y-6">
        {/* 상단: 회사 기본 정보 */}
        <Card className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold mb-1">{company.name}</h2>
            <div className="text-gray-600 text-sm mb-1">{company.address}</div>
            <div className="flex gap-4 text-sm text-gray-500">
              <span>대표번호: {company.mainPhoneNumber || '-'}</span>
              <span>등록일: {new Date(company.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
          <div className="flex flex-col gap-1 text-sm">
            <div>주담당자: {company.contacts.find(c => c.isPrimary)?.name || (company.contacts[0]?.name ?? '-')}</div>
            <div>이메일: {company.contacts.find(c => c.isPrimary)?.email || (company.contacts[0]?.email ?? '-')}</div>
          </div>
        </Card>
        {/* 탭 UI */}
        <div className="border-b flex gap-2">
          {tabs.map(t => (
            <button
              key={t.key}
              className={`px-4 py-2 -mb-px border-b-2 font-medium transition-colors ${tab === t.key ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-blue-600'}`}
              onClick={() => setTab(t.key as any)}
            >
              {t.label}
            </button>
          ))}
        </div>
        {/* 탭별 내용 - 뼈대만 */}
        <div>
          {tab === 'overview' && (
            <div className="space-y-4">
              <div className="font-semibold text-lg">Client Overview</div>
              {/* TODO: 고객사 요약, 최근 미팅/업무/계약/연구 등 카드/리스트 */}
              <div className="text-gray-400">업무 요약 카드/리스트 영역 (추후 구현)</div>
            </div>
          )}
          {tab === 'meetings' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-2">
                <div className="font-semibold text-lg">Meeting Records</div>
                <Button variant="primary" size="sm" onClick={() => setShowMeetingModal(true)}>+ Log Meeting</Button>
              </div>
              {/* 미팅 리스트 */}
              {meetings.filter(m => m.companyId === company.id).length === 0 ? (
                <div className="text-gray-400 text-sm">No meetings logged for this client yet.</div>
              ) : (
                <ul className="divide-y">
                  {meetings.filter(m => m.companyId === company.id).map(m => (
                    <li key={m.id} className="py-3 flex items-center justify-between">
                      <div>
                        <div className="font-medium">{m.title}</div>
                        <div className="text-xs text-gray-500">{m.date} | 참석자: {m.attendees}</div>
                        <div className="text-xs text-gray-400">{m.summary}</div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => { setEditingMeeting(m); setShowMeetingModal(true); }}><PencilIcon className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteMeeting(m.id)}><TrashIcon className="w-4 h-4 text-red-500" /></Button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              {/* 미팅 추가/수정 폼 모달 (뼈대) */}
              <Modal isOpen={showMeetingModal} onClose={() => { setShowMeetingModal(false); setEditingMeeting(null); }} title={editingMeeting ? 'Edit Meeting' : 'Log Meeting'}>
                <MeetingForm
                  meeting={editingMeeting}
                  companies={[company]}
                  onSubmit={data => {
                    if (editingMeeting) {
                      // 수정
                      handleUpdateMeeting(editingMeeting.id, { ...data, companyId: company.id });
                    } else {
                      // 신규
                      handleCreateMeeting({ ...data, companyId: company.id });
                    }
                    setShowMeetingModal(false);
                    setEditingMeeting(null);
                  }}
                  onCancel={() => { setShowMeetingModal(false); setEditingMeeting(null); }}
                />
              </Modal>
            </div>
          )}
          {tab === 'tasks' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-2">
                <div className="font-semibold text-lg">Project Schedule (Gantt Chart)</div>
                <Button variant="primary" size="sm" onClick={() => setShowTaskModal(true)}>+ Add Task</Button>
              </div>
              {/* Gantt 차트 */}
              <GanttChartRenderer
                tasks={tasks.filter(t => t.companyId === company.id)}
                companies={[company]}
                onTaskClick={t => { setEditingTask(t); setShowTaskModal(true); }}
              />
              {/* 태스크 리스트 */}
              {tasks.filter(t => t.companyId === company.id).length === 0 ? (
                <div className="text-gray-400 text-sm">No tasks created for this client yet.</div>
              ) : (
                <ul className="divide-y">
                  {tasks.filter(t => t.companyId === company.id).map(t => (
                    <li key={t.id} className="py-3 flex items-center justify-between">
                      <div>
                        <div className="font-medium">{t.name}</div>
                        <div className="text-xs text-gray-500">{t.startDate} ~ {t.endDate} | 담당자: {t.assignee}</div>
                        <div className="text-xs text-gray-400">{t.description}</div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => { setEditingTask(t); setShowTaskModal(true); }}><PencilIcon className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteTask(t.id)}><TrashIcon className="w-4 h-4 text-red-500" /></Button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              {/* 태스크 추가/수정 폼 모달 (뼈대) */}
              <Modal isOpen={showTaskModal} onClose={() => { setShowTaskModal(false); setEditingTask(null); }} title={editingTask ? 'Edit Task' : 'Add Task'}>
                <TaskForm
                  task={editingTask}
                  companies={[company]}
                  onSubmit={data => {
                    if (editingTask) {
                      // 수정
                      handleUpdateTask(editingTask.id, { ...data, companyId: company.id });
                    } else {
                      // 신규
                      handleCreateTask({ ...data, companyId: company.id });
                    }
                    setShowTaskModal(false);
                    setEditingTask(null);
                  }}
                  onCancel={() => { setShowTaskModal(false); setEditingTask(null); }}
                />
              </Modal>
            </div>
          )}
          {tab === 'financials' && (
            <div className="space-y-8">
              {/* 견적 */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <div className="font-semibold text-lg">Quotations</div>
                  <Button variant="primary" size="sm" onClick={() => setShowQuotationModal(true)}>+ Add Quotation</Button>
                </div>
                {company.quotations?.length ? (
                  <ul className="divide-y">
                    {company.quotations.map(q => (
                      <li key={q.id} className="py-3 flex items-center justify-between">
                        <div>
                          <div className="font-medium">{q.quotationName}</div>
                          <div className="text-xs text-gray-500">번호: {q.quotationNumber} | 금액: {q.quotationAmount}</div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" onClick={() => { setEditingQuotation(q); setShowQuotationModal(true); }}><PencilIcon className="w-4 h-4" /></Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteTask(q.id)}><TrashIcon className="w-4 h-4 text-red-500" /></Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-gray-400 text-sm">No quotations recorded for this client.</div>
                )}
                {/* 견적 추가/수정 폼 모달 (뼈대) */}
                <Modal isOpen={showQuotationModal} onClose={() => { setShowQuotationModal(false); setEditingQuotation(null); }} title={editingQuotation ? 'Edit Quotation' : 'Add Quotation'}>
                  <QuotationForm
                    quotation={editingQuotation}
                    companyId={company.id}
                    onSubmit={data => {
                      if (editingQuotation) {
                        handleUpdateQuotation(editingQuotation.id, { ...data, companyId: company.id });
                      } else {
                        handleCreateQuotation({ ...data, companyId: company.id });
                      }
                      setShowQuotationModal(false);
                      setEditingQuotation(null);
                    }}
                    onCancel={() => { setShowQuotationModal(false); setEditingQuotation(null); }}
                  />
                </Modal>
              </div>
              {/* 계약 */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <div className="font-semibold text-lg">Contracts</div>
                  <Button variant="primary" size="sm" onClick={() => setShowContractModal(true)}>+ Add Contract</Button>
                </div>
                {company.contracts?.length ? (
                  <ul className="divide-y">
                    {company.contracts.map(c => (
                      <li key={c.id} className="py-3 flex items-center justify-between">
                        <div>
                          <div className="font-medium">{c.contractName}</div>
                          <div className="text-xs text-gray-500">번호: {c.contractNumber} | 금액: {c.contractAmount} | 기간: {c.contractPeriodStart} ~ {c.contractPeriodEnd}</div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" onClick={() => { setEditingContract(c); setShowContractModal(true); }}><PencilIcon className="w-4 h-4" /></Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteTask(c.id)}><TrashIcon className="w-4 h-4 text-red-500" /></Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-gray-400 text-sm">No contracts recorded for this client.</div>
                )}
                {/* 계약 추가/수정 폼 모달 (뼈대) */}
                <Modal isOpen={showContractModal} onClose={() => { setShowContractModal(false); setEditingContract(null); }} title={editingContract ? 'Edit Contract' : 'Add Contract'}>
                  <ContractForm
                    contract={editingContract}
                    companyId={company.id}
                    onSubmit={data => {
                      if (editingContract) {
                        handleUpdateContract(editingContract.id, { ...data, companyId: company.id });
                      } else {
                        handleCreateContract({ ...data, companyId: company.id });
                      }
                      setShowContractModal(false);
                      setEditingContract(null);
                    }}
                    onCancel={() => { setShowContractModal(false); setEditingContract(null); }}
                  />
                </Modal>
              </div>
            </div>
          )}
          {tab === 'studies' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-2">
                <div className="font-semibold text-lg">Study Information</div>
                <Button variant="primary" size="sm" onClick={() => setShowStudyModal(true)}>+ Add Study</Button>
              </div>
              {company.studies?.length ? (
                <ul className="divide-y">
                  {company.studies.map(s => (
                    <li key={s.id} className="py-3 flex items-center justify-between">
                      <div>
                        <div className="font-medium">{s.studyName}</div>
                        <div className="text-xs text-gray-500">번호: {s.studyNumber} | 책임자: {s.studyDirector} | 기간: {s.studyPeriodStart} ~ {s.studyPeriodEnd}</div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => { setEditingStudy(s); setShowStudyModal(true); }}><PencilIcon className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteStudy(s.id)}><TrashIcon className="w-4 h-4 text-red-500" /></Button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-gray-400 text-sm">No studies recorded for this client.</div>
              )}
              {/* 연구 추가/수정 폼 모달 (뼈대) */}
              <Modal isOpen={showStudyModal} onClose={() => { setShowStudyModal(false); setEditingStudy(null); }} title={editingStudy ? 'Edit Study' : 'Add Study'}>
                {/* TODO: StudyForm 연동 및 저장 로직 */}
                <div className="text-gray-400">StudyForm 및 저장 로직 영역 (추후 구현)</div>
              </Modal>
            </div>
          )}
          {tab === 'notes' && (
            <div className="space-y-4">
              <div className="font-semibold text-lg">Notes</div>
              <form onSubmit={handleNotesSave}>
                <Textarea
                  value={notesDraft}
                  onChange={handleNotesChange}
                  className="w-full min-h-[120px]"
                />
                <div className="flex gap-2 mt-2">
                  <Button type="submit" variant="primary">저장</Button>
                  {notesSaved && <span className="text-green-600 text-sm mt-2">저장됨</span>}
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    );
  };

  // 캘린더 렌더링
  const renderCalendar = (
    currentDate: Date,
    setCurrentDate: React.Dispatch<React.SetStateAction<Date>>,
    selectedDate: Date | null,
    setSelectedDate: React.Dispatch<React.SetStateAction<Date | null>>,
    showDayModal: boolean,
    setShowDayModal: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    // 달력 날짜 생성
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDayOfWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();
    const today = new Date();

    // 달력 6주(42칸) 배열 생성
    const calendarDays: (Date | null)[] = [];
    for (let i = 0; i < startDayOfWeek; i++) calendarDays.push(null);
    for (let d = 1; d <= daysInMonth; d++) calendarDays.push(new Date(year, month, d));
    while (calendarDays.length % 7 !== 0) calendarDays.push(null);

    // 날짜별 미팅/태스크
    const getItemsForDate = (date: Date) => {
      const dateStr = date.toISOString().slice(0, 10);
      const dayMeetings = meetings.filter(m => m.date.slice(0, 10) === dateStr);
      const dayTasks = tasks.filter(t => t.startDate.slice(0, 10) <= dateStr && t.endDate.slice(0, 10) >= dateStr);
      // 계약 시작/종료/세금계산서 발행 예정
      const dayContracts = companies.flatMap(c => (c.contracts || []).map(ct => ({ ...ct, companyName: c.name }))).filter(ct => {
        // 계약 시작/종료
        if (ct.contractPeriodStart === dateStr || ct.contractPeriodEnd === dateStr) return true;
        // 세금계산서 발행 예정
        if (ct.contractSigningDate) {
          const d = new Date(ct.contractSigningDate); d.setDate(d.getDate() + 30);
          return d.toISOString().slice(0, 10) === dateStr;
        }
        return false;
      });
      return { dayMeetings, dayTasks, dayContracts };
    };

    // 월 이동
    const goToPrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
    const goToNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
    const goToToday = () => setCurrentDate(new Date());

    return (
      <div className="space-y-6">
        {/* 상단 컨트롤 */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={goToPrevMonth}><ChevronLeftIcon className="w-5 h-5" /></Button>
            <div className="font-semibold text-lg">{year}년 {month + 1}월</div>
            <Button variant="ghost" size="sm" onClick={goToNextMonth}><ChevronRightIcon className="w-5 h-5" /></Button>
          </div>
          <Button variant="secondary" size="sm" onClick={goToToday}>오늘로 이동</Button>
        </div>
        {/* 달력 표 */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded-lg shadow-sm select-none">
            <thead>
              <tr className="bg-gray-50 text-gray-700 text-xs">
                {['일', '월', '화', '수', '목', '금', '토'].map((d, i) => (
                  <th key={d} className={`px-2 py-1 text-center ${i === 0 ? 'text-red-500' : i === 6 ? 'text-blue-500' : ''}`}>{d}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: calendarDays.length / 7 }).map((_, weekIdx) => (
                <tr key={weekIdx}>
                  {calendarDays.slice(weekIdx * 7, weekIdx * 7 + 7).map((date, i) => {
                    const isToday = date && date.toDateString() === today.toDateString();
                    const isSelected = date && selectedDate && date.toDateString() === selectedDate.toDateString();
                    const { dayMeetings, dayTasks, dayContracts } = date ? getItemsForDate(date) : { dayMeetings: [], dayTasks: [], dayContracts: [] };
                    return (
                      <td
                        key={i}
                        className={`h-20 w-20 align-top p-1 border text-center cursor-pointer transition relative
                        ${i === 0 ? 'text-red-500' : i === 6 ? 'text-blue-500' : ''}
                        ${isToday ? 'bg-yellow-100 font-bold' : ''}
                        ${isSelected ? 'ring-2 ring-blue-400' : ''}
                        ${date ? 'hover:bg-blue-50' : 'bg-gray-50'}`}
                        onClick={() => date && (setSelectedDate(date), setShowDayModal(true))}
                      >
                        <div className="text-xs mb-1">{date ? date.getDate() : ''}</div>
                        <div className="flex flex-col gap-0.5 items-center">
                          {dayMeetings.length > 0 && (
                            <div className="bg-blue-100 text-blue-800 rounded px-1 text-xs mb-0.5">
                              {dayMeetings.map(m => {
                                const companyObj = companies.find(c => c.id === m.companyId);
                                return (
                                  <div key={m.id}>
                                    <b>{m.title}</b> <span className="text-gray-500">({companyObj?.name})</span><br />
                                    <span className="text-gray-400">참석자: {m.attendees}</span>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                          {dayTasks.length > 0 && (
                            <div className="bg-green-100 text-green-800 rounded px-1 text-xs">
                              {dayTasks.map(t => {
                                const companyObj = companies.find(c => c.id === t.companyId);
                                return (
                                  <div key={t.id}>
                                    <b>{t.name}</b> <span className="text-gray-500">({companyObj?.name})</span><br />
                                    <span className="text-gray-400">담당자: {t.assignee}</span>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                          {dayContracts.length > 0 && (
                            <div className="bg-yellow-100 text-yellow-800 rounded px-1 text-xs mt-0.5">
                              {dayContracts.map(ct => (
                                <div key={ct.id}>
                                  <b>{ct.contractName}</b> <span className="text-gray-500">({ct.companyName})</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* 날짜 상세 모달 */}
        {showDayModal && selectedDate && (
          <Modal isOpen={showDayModal} onClose={() => setShowDayModal(false)} title={`${selectedDate.getFullYear()}년 ${selectedDate.getMonth() + 1}월 ${selectedDate.getDate()}일 일정`}>
            <div className="space-y-4">
              <div>
                <div className="font-semibold mb-1">미팅</div>
                {getItemsForDate(selectedDate).dayMeetings.length === 0 ? (
                  <div className="text-gray-400 text-sm">미팅이 없습니다.</div>
                ) : (
                  <ul className="space-y-1">
                    {getItemsForDate(selectedDate).dayMeetings.map(m => (
                      <li key={m.id} className="flex items-center gap-2">
                        <CalendarDaysIcon className="w-4 h-4 text-blue-500" />
                        <span className="font-medium">{m.title}</span>
                        <span className="text-xs text-gray-500">{m.attendees}</span>
                        <Button variant="ghost" size="sm" onClick={() => { setEditingMeeting(m); setShowDayModal(false); }}>상세</Button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div>
                <div className="font-semibold mb-1">태스크</div>
                {getItemsForDate(selectedDate).dayTasks.length === 0 ? (
                  <div className="text-gray-400 text-sm">태스크가 없습니다.</div>
                ) : (
                  <ul className="space-y-1">
                    {getItemsForDate(selectedDate).dayTasks.map(t => (
                      <li key={t.id} className="flex items-center gap-2">
                        <ClipboardDocumentListIcon className="w-4 h-4 text-green-500" />
                        <span className="font-medium">{t.name}</span>
                        <span className="text-xs text-gray-500">{t.status}</span>
                        <Button variant="ghost" size="sm" onClick={() => { setEditingTask(t); setShowDayModal(false); }}>상세</Button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div>
                <div className="font-semibold mb-1">계약</div>
                {getItemsForDate(selectedDate).dayContracts.length === 0 ? (
                  <div className="text-gray-400 text-sm">계약 일정이 없습니다.</div>
                ) : (
                  <ul className="space-y-1">
                    {getItemsForDate(selectedDate).dayContracts.map(ct => (
                      <li key={ct.id} className="flex items-center gap-2">
                        <ClipboardDocumentListIcon className="w-4 h-4 text-yellow-500" />
                        <span className="font-medium">{ct.contractName}</span>
                        <span className="text-xs text-gray-500">{ct.companyName}</span>
                        <span className="text-xs text-gray-500">{ct.contractPeriodStart === selectedDate.toISOString().slice(0, 10) ? '시작' : ct.contractPeriodEnd === selectedDate.toISOString().slice(0, 10) ? '종료' : '세금계산서 발행'}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </Modal>
        )}
      </div>
    );
  };

  // 분석 렌더링
  const renderAnalytics = () => {
    // 통계 데이터
    const totalCompanies = companies.length;
    const totalContracts = companies.reduce((sum, c) => sum + (c.contracts?.length || 0), 0);
    const totalQuotations = companies.reduce((sum, c) => sum + (c.quotations?.length || 0), 0);
    const totalStudies = companies.reduce((sum, c) => sum + (c.studies?.length || 0), 0);
    const totalMeetings = meetings.length;
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === TaskStatus.Completed).length;
    const taskCompletionRate = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // 월별 계약/견적/연구/미팅/태스크 트렌드 데이터
    const getMonth = (dateStr: string) => dateStr.slice(0, 7);
    const months = Array.from(new Set([
      ...companies.flatMap(c => [
        ...(c.contracts?.map(ct => getMonth(ct.contractPeriodStart)) || []),
        ...(c.quotations?.map(q => getMonth(q.quotationNumber)) || []),
        ...(c.studies?.map(s => getMonth(s.studyPeriodStart)) || [])
      ]),
      ...meetings.map(m => getMonth(m.date)),
      ...tasks.map(t => getMonth(t.startDate))
    ])).sort();
    const trendData = months.map(month => ({
      month,
      contracts: companies.reduce((sum, c) => sum + (c.contracts?.filter(ct => getMonth(ct.contractPeriodStart) === month).length || 0), 0),
      quotations: companies.reduce((sum, c) => sum + (c.quotations?.filter(q => getMonth(q.quotationNumber) === month).length || 0), 0),
      studies: companies.reduce((sum, c) => sum + (c.studies?.filter(s => getMonth(s.studyPeriodStart) === month).length || 0), 0),
      meetings: meetings.filter(m => getMonth(m.date) === month).length,
      tasks: tasks.filter(t => getMonth(t.startDate) === month).length
    }));

    // 최근 계약/견적/연구
    const recentContracts = companies.flatMap(c => c.contracts?.map(ct => ({ ...ct, company: c.name })) || []).sort((a, b) => b.contractPeriodStart.localeCompare(a.contractPeriodStart)).slice(0, 5);
    const recentQuotations = companies.flatMap(c => c.quotations?.map(q => ({ ...q, company: c.name })) || []).sort((a, b) => b.quotationNumber.localeCompare(a.quotationNumber)).slice(0, 5);
    const recentStudies = companies.flatMap(c => c.studies?.map(s => ({ ...s, company: c.name })) || []).sort((a, b) => b.studyPeriodStart.localeCompare(a.studyPeriodStart)).slice(0, 5);

    return (
      <div className="space-y-6">
        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
          <StatCard title="고객사" value={totalCompanies} icon={<UserCircleIcon className="w-6 h-6" />} />
          <StatCard title="계약" value={totalContracts} icon={<ClipboardDocumentListIcon className="w-6 h-6" />} />
          <StatCard title="견적" value={totalQuotations} icon={<BeakerIcon className="w-6 h-6" />} />
          <StatCard title="연구" value={totalStudies} icon={<ChartPieIcon className="w-6 h-6" />} />
          <StatCard title="미팅" value={totalMeetings} icon={<CalendarDaysIcon className="w-6 h-6" />} />
          <StatCard title="태스크" value={totalTasks} icon={<ListBulletIcon className="w-6 h-6" />} />
        </div>
        {/* 완료율 카드 */}
        <div className="flex gap-4 items-center">
          <div className="font-semibold">태스크 완료율</div>
          <div className="w-64 bg-gray-100 rounded-full h-4 overflow-hidden">
            <div className="bg-green-500 h-4 rounded-full" style={{ width: `${taskCompletionRate}%` }} />
          </div>
          <div className="font-bold text-green-600 ml-2">{taskCompletionRate}%</div>
        </div>
        {/* 월별 트렌드 바 차트 */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4">월별 계약/견적/연구/미팅/태스크 트렌드</h3>
          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData} margin={{ top: 16, right: 16, left: 0, bottom: 0 }}>
                <XAxis dataKey="month" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Legend />
                <Bar dataKey="contracts" stackId="a" fill="#6366f1" name="계약" />
                <Bar dataKey="quotations" stackId="a" fill="#f59e42" name="견적" />
                <Bar dataKey="studies" stackId="a" fill="#10b981" name="연구" />
                <Bar dataKey="meetings" stackId="a" fill="#3b82f6" name="미팅" />
                <Bar dataKey="tasks" stackId="a" fill="#f43f5e" name="태스크" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        {/* 최근 계약/견적/연구 테이블 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-4">
            <h4 className="font-semibold mb-2">최근 계약</h4>
            <table className="min-w-full text-sm">
              <thead><tr><th className="text-left">회사</th><th className="text-left">계약명</th><th className="text-left">기간</th></tr></thead>
              <tbody>
                {recentContracts.length === 0 ? <tr><td colSpan={3} className="text-gray-400 py-4">없음</td></tr> : recentContracts.map(c => (
                  <tr key={c.id}><td>{c.company}</td><td>{c.contractName}</td><td>{c.contractPeriodStart}~{c.contractPeriodEnd}</td></tr>
                ))}
              </tbody>
            </table>
          </Card>
          <Card className="p-4">
            <h4 className="font-semibold mb-2">최근 견적</h4>
            <table className="min-w-full text-sm">
              <thead><tr><th className="text-left">회사</th><th className="text-left">견적명</th><th className="text-left">번호</th></tr></thead>
              <tbody>
                {recentQuotations.length === 0 ? <tr><td colSpan={3} className="text-gray-400 py-4">없음</td></tr> : recentQuotations.map(q => (
                  <tr key={q.id}><td>{q.company}</td><td>{q.quotationName}</td><td>{q.quotationNumber}</td></tr>
                ))}
              </tbody>
            </table>
          </Card>
          <Card className="p-4">
            <h4 className="font-semibold mb-2">최근 연구</h4>
            <table className="min-w-full text-sm">
              <thead><tr><th className="text-left">회사</th><th className="text-left">연구명</th><th className="text-left">기간</th></tr></thead>
              <tbody>
                {recentStudies.length === 0 ? <tr><td colSpan={3} className="text-gray-400 py-4">없음</td></tr> : recentStudies.map(s => (
                  <tr key={s.id}><td>{s.company}</td><td>{s.studyName}</td><td>{s.studyPeriodStart}~{s.studyPeriodEnd}</td></tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      </div>
    );
  };

  // 데이터 내보내기 렌더링
  const renderDataExport = () => {
    // CSV 내보내기 함수
    function exportToCSV(filename: string, headers: string[], rows: (string | number)[][]) {
      const csvContent = [
        '\uFEFF' + headers.join(','),
        ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      ].join('\r\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    // 각 데이터 내보내기
    const exportCompanies = () => {
      exportToCSV('companies.csv',
        ['ID', '회사명', '주소', '대표번호', '등록일'],
        companies.map(c => [c.id, c.name, c.address, c.mainPhoneNumber || '', c.createdAt])
      );
    };
    const exportContracts = () => {
      exportToCSV('contracts.csv',
        ['ID', '회사명', '계약명', '계약번호', '금액', '기간', '담당자'],
        companies.flatMap(c => (c.contracts || []).map(ct => [ct.id, c.name, ct.contractName, ct.contractNumber, ct.contractAmount, `${ct.contractPeriodStart}~${ct.contractPeriodEnd}`, c.contacts.find(ctc => ctc.id === ct.contactId)?.name || '']))
      );
    };
    const exportQuotations = () => {
      exportToCSV('quotations.csv',
        ['ID', '회사명', '견적명', '견적번호', '금액', '담당자'],
        companies.flatMap(c => (c.quotations || []).map(q => [q.id, c.name, q.quotationName, q.quotationNumber, q.quotationAmount, c.contacts.find(ctc => ctc.id === q.contactId)?.name || '']))
      );
    };
    const exportStudies = () => {
      exportToCSV('studies.csv',
        ['ID', '회사명', '연구명', '연구번호', '책임자', '기간', '담당자'],
        companies.flatMap(c => (c.studies || []).map(s => [s.id, c.name, s.studyName, s.studyNumber, s.studyDirector, `${s.studyPeriodStart}~${s.studyPeriodEnd}`, c.contacts.find(ctc => ctc.id === s.contactId)?.name || '']))
      );
    };
    const exportMeetings = () => {
      exportToCSV('meetings.csv',
        ['ID', '회사명', '제목', '날짜', '참석자', '요약'],
        meetings.map(m => [m.id, companies.find(c => c.id === m.companyId)?.name || '', m.title, m.date, m.attendees, m.summary])
      );
    };
    const exportTasks = () => {
      exportToCSV('tasks.csv',
        ['ID', '회사명', '태스크명', '시작일', '마감일', '상태', '담당자'],
        tasks.map(t => [t.id, companies.find(c => c.id === t.companyId)?.name || '', t.name, t.startDate, t.endDate, t.status, t.assignee || ''])
      );
    };

    return (
      <div className="space-y-6 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">데이터 내보내기</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-4 flex flex-col gap-2">
            <div className="font-semibold mb-2">고객사</div>
            <Button variant="primary" onClick={exportCompanies}>고객사 CSV 내보내기</Button>
          </Card>
          <Card className="p-4 flex flex-col gap-2">
            <div className="font-semibold mb-2">계약</div>
            <Button variant="primary" onClick={exportContracts}>계약 CSV 내보내기</Button>
          </Card>
          <Card className="p-4 flex flex-col gap-2">
            <div className="font-semibold mb-2">견적</div>
            <Button variant="primary" onClick={exportQuotations}>견적 CSV 내보내기</Button>
          </Card>
          <Card className="p-4 flex flex-col gap-2">
            <div className="font-semibold mb-2">연구</div>
            <Button variant="primary" onClick={exportStudies}>연구 CSV 내보내기</Button>
          </Card>
          <Card className="p-4 flex flex-col gap-2">
            <div className="font-semibold mb-2">미팅</div>
            <Button variant="primary" onClick={exportMeetings}>미팅 CSV 내보내기</Button>
          </Card>
          <Card className="p-4 flex flex-col gap-2">
            <div className="font-semibold mb-2">태스크</div>
            <Button variant="primary" onClick={exportTasks}>태스크 CSV 내보내기</Button>
          </Card>
        </div>
        <div className="text-xs text-gray-500 mt-4">* 내보내기 파일은 UTF-8 BOM이 포함되어 엑셀에서 한글이 깨지지 않습니다.</div>
      </div>
    );
  };

  // 설정 렌더링
  const renderSettings = () => {
    // 테마 상태(라이트/다크)
    const [theme, setTheme] = useState<'light' | 'dark'>(localStorage.getItem('theme') === 'dark' ? 'dark' : 'light');
    useEffect(() => {
      document.documentElement.classList.toggle('dark', theme === 'dark');
      localStorage.setItem('theme', theme);
    }, [theme]);

    // 사용자 정보(예시)
    const [user, setUser] = useState({ name: '홍길동', email: 'user@example.com' });
    const [editUser, setEditUser] = useState(user);
    const [editing, setEditing] = useState(false);

    // 기타 환경설정(알림, 언어)
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [language, setLanguage] = useState('ko');

    return (
      <div className="max-w-xl mx-auto space-y-8">
        <h2 className="text-2xl font-bold mb-4">설정</h2>
        {/* 테마 설정 */}
        <Card className="p-6 flex flex-col gap-2">
          <div className="font-semibold mb-2">테마</div>
          <div className="flex gap-4 items-center">
            <Button variant={theme === 'light' ? 'primary' : 'secondary'} onClick={() => setTheme('light')}>라이트</Button>
            <Button variant={theme === 'dark' ? 'primary' : 'secondary'} onClick={() => setTheme('dark')}>다크</Button>
          </div>
        </Card>
        {/* 사용자 정보 */}
        <Card className="p-6 flex flex-col gap-2">
          <div className="font-semibold mb-2">사용자 정보</div>
          {editing ? (
            <div className="flex flex-col gap-2">
              <Input value={editUser.name} onChange={e => setEditUser({ ...editUser, name: e.target.value })} />
              <Input value={editUser.email} onChange={e => setEditUser({ ...editUser, email: e.target.value })} />
              <div className="flex gap-2">
                <Button variant="primary" onClick={() => { setUser(editUser); setEditing(false); }}>저장</Button>
                <Button variant="ghost" onClick={() => { setEditUser(user); setEditing(false); }}>취소</Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <div>이름: {user.name}</div>
              <div>이메일: {user.email}</div>
              <Button variant="ghost" onClick={() => setEditing(true)}>수정</Button>
            </div>
          )}
        </Card>
        {/* 기타 환경설정 */}
        <Card className="p-6 flex flex-col gap-2">
          <div className="font-semibold mb-2">환경설정</div>
          <div className="flex items-center gap-2">
            <input type="checkbox" checked={notificationsEnabled} onChange={e => setNotificationsEnabled(e.target.checked)} id="noti" />
            <label htmlFor="noti" className="text-sm">알림 받기</label>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <label htmlFor="lang" className="text-sm">언어</label>
            <Select value={language} onChange={e => setLanguage(e.target.value)} className="w-32">
              <option value="ko">한국어</option>
              <option value="en">English</option>
            </Select>
          </div>
        </Card>
      </div>
    );
  };

  // 메인 컨텐츠 렌더링
  const renderContent = () => {
    switch (view.type) {
      case 'dashboard':
        return renderDashboard();
      case 'clientList':
        return renderClientList(
          clientListSearch,
          setClientListSearch,
          clientListSortKey,
          setClientListSortKey,
          clientListSortAsc,
          setClientListSortAsc
        );
      case 'clientDetail':
        return renderClientDetail(clientDetailTab, setClientDetailTab);
      case 'calendar':
        return renderCalendar(
          calendarCurrentDate,
          setCalendarCurrentDate,
          calendarSelectedDate,
          setCalendarSelectedDate,
          calendarShowDayModal,
          setCalendarShowDayModal
        );
      case 'analytics':
        return renderAnalytics();
      case 'dataExport':
        return renderDataExport();
      case 'settings':
        return renderSettings();
      default:
        return renderDashboard();
    }
  };

  // App 컴포넌트 내 useState 선언 아래에 더미 핸들러 함수 추가
  const handleUpdateQuotation = async (id: string, data: any) => { };
  const handleCreateQuotation = async (data: any) => { };
  const handleUpdateContract = async (id: string, data: any) => { };
  const handleCreateContract = async (data: any) => { };
  const handleDeleteStudy = async (id: string) => { };

  // 기존 useState import 및 상태 선언 아래에 추가
  const [notesDraftMap, setNotesDraftMap] = useState<{ [companyId: string]: string }>({});
  const [notesSavedMap, setNotesSavedMap] = useState<{ [companyId: string]: boolean }>({});

  // 사이드바 상태
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* 사이드 네비게이션 */}
      <aside className={`fixed md:static z-30 top-0 left-0 h-full w-48 md:w-56 lg:w-64 bg-white border-r flex flex-col transition-transform duration-200 md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`} style={{backgroundColor: '#fff'}}>
        <div className="h-16 flex items-center justify-center font-bold text-xl border-b" style={{color: '#1a237e'}}>CRM</div>
        <nav className="flex-1 flex flex-col items-center gap-2 py-6">
          <button onClick={() => setView({ type: 'dashboard' })} className={`w-16 h-16 flex items-center justify-center rounded-lg transition-colors ${view.type === 'dashboard' ? 'bg-[#1a237e] text-white' : 'text-[#1a237e] hover:bg-[#e3e7f7]'}`}> <DashboardIcon className="w-12 h-12" /> </button>
          <button onClick={() => setView({ type: 'clientList' })} className={`w-16 h-16 flex items-center justify-center rounded-lg transition-colors ${view.type === 'clientList' ? 'bg-[#ff9800] text-white' : 'text-[#ff9800] hover:bg-orange-100'}`}> <ClientsIcon className="w-12 h-12" /> </button>
          <button onClick={() => setView({ type: 'calendar' })} className={`w-16 h-16 flex items-center justify-center rounded-lg transition-colors ${view.type === 'calendar' ? 'bg-[#1a237e] text-white' : 'text-[#1a237e] hover:bg-[#e3e7f7]'}`}> <CalendarDaysIcon className="w-12 h-12" /> </button>
          <button onClick={() => setView({ type: 'analytics' })} className={`w-16 h-16 flex items-center justify-center rounded-lg transition-colors ${view.type === 'analytics' ? 'bg-[#ff9800] text-white' : 'text-[#ff9800] hover:bg-orange-100'}`}> <ChartBarIcon className="w-12 h-12" /> </button>
        </nav>
        <div className="flex flex-col items-center gap-2 p-4 border-t mt-auto">
          <button className="w-12 h-12 flex items-center justify-center rounded-full text-[#1a237e] hover:bg-[#e3e7f7]"> <UserCircleIcon className="w-8 h-8" /> </button>
          <button className="w-12 h-12 flex items-center justify-center rounded-full text-[#ff9800] hover:bg-orange-100"> <Bars3Icon className="w-8 h-8" /> </button>
        </div>
      </aside>
      {/* 모바일 햄버거 버튼 */}
      <button className="fixed top-4 left-4 z-40 md:hidden bg-white border rounded-full p-2 shadow" onClick={() => setSidebarOpen(v => !v)}>
        <Bars3Icon className="w-6 h-6 text-[#1a237e]" />
      </button>
      {/* 메인 컨텐츠 */}
      <main className="flex-1 ml-0 pl-6 md:pl-8 lg:pl-10 transition-all duration-200">
        <div className="px-4 sm:px-6 lg:px-8 py-8"> {/* 좌우 패딩만 추가, 최대 너비 제한 없음 */}
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default App; 