export interface Contact {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  isPrimary: boolean;
  department?: string;
  fax?: string;
}

export interface Company {
  id: string;
  name: string;
  address: string;
  contacts: Contact[];
  notes?: string;
  createdAt: string;
  quotations?: Quotation[];
  contracts?: Contract[];
  studies?: Study[];
  website?: string;
  mainPhoneNumber?: string;
}

export interface Quotation {
  id: string;
  contactId: string;
  quotationNumber: string;
  quotationName: string;
  quotationAmount: string;
  discountRate?: string;
  paymentTerms?: string;
}

export interface Contract {
  id: string;
  contactId: string;
  contractNumber: string;
  contractName: string;
  contractAmount: string;
  contractPeriodStart: string;
  contractPeriodEnd: string;
  contractSigningDate?: string;
  paymentTerms?: string;
  taxInvoiceIssued?: boolean;
  taxInvoiceIssueDate?: string;
}

export interface Study {
  id: string;
  contactId: string;
  studyNumber: string;
  studyName: string;
  studyDirector: string;
  studyPeriodStart: string;
  studyPeriodEnd: string;
  testingStandards?: string;
  substanceInfo?: string;
  submissionPurpose?: string;
}

export interface Meeting {
  id: string;
  companyId: string;
  contactId?: string;
  title: string;
  date: string;
  attendees: string;
  summary: string;
  actionItems?: string;
}

export enum TaskStatus {
  Pending = 'Pending',
  InProgress = 'In Progress',
  Completed = 'Completed',
  Delayed = 'Delayed',
  OnHold = 'On Hold'
}

export interface Task {
  id: string;
  companyId: string;
  contactId?: string;
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  status: TaskStatus;
  assignee?: string;
}

export type View =
  | { type: 'dashboard' }
  | { type: 'clientList' }
  | { type: 'clientDetail'; clientId: string }
  | { type: 'calendar' }
  | { type: 'analytics' }
  | { type: 'dataExport' }
  | { type: 'settings' }
  | { type: 'admin' };

export interface NotificationItem {
  id: string;
  message: string;
  type: 'info' | 'warning' | 'error';
  relatedId?: string;
  isRead: boolean;
  createdAt: string;
}

export type UserRole = 'admin' | 'user';
export interface User {
  id: string;
  username: string;
  role: UserRole;
  createdAt: string;
} 