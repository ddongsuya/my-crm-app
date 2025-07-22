import React, { useState } from 'react';
import { Company, Meeting, Task, TaskStatus, Contact, Quotation, Contract, Study } from './types';
import {
  PlusIcon, TrashIcon, PencilIcon, XMarkIcon, CalendarDaysIcon, UserCircleIcon, EnvelopeIcon, PhoneIcon, MapPinIcon, InformationCircleIcon, ClipboardDocumentListIcon, BeakerIcon, CalendarModernIcon, ChartBarIcon, ChartPieIcon
} from './icons';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from 'recharts';

// 기본 UI 컴포넌트들
export const Button: React.FC<{
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}> = ({ children, variant = 'primary', size = 'md', onClick, className = '', type = 'button', disabled }) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background';

  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
    ghost: 'hover:bg-gray-100 text-gray-700'
  };

  const sizeClasses = {
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-4 py-2',
    lg: 'h-12 px-6 text-lg'
  };

  return (
    <button
      type={type}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export const Card: React.FC<{
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}> = ({ children, className = '', onClick }) => (
  <div className={`bg-white rounded-lg shadow-sm border ${className}`} onClick={onClick}>
    {children}
  </div>
);

export const Input: React.FC<{
  placeholder?: string;
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  className?: string;
  type?: string;
  required?: boolean;
  readOnly?: boolean;
  disabled?: boolean;
}> = ({ placeholder, value, onChange, className = '', type = 'text', required, readOnly, disabled }) => (
  <input
    type={type}
    className={`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    {...(required ? { required: true } : {})}
    {...(readOnly ? { readOnly: true } : {})}
    {...(disabled ? { disabled: true } : {})}
  />
);

export const Textarea: React.FC<{
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  className?: string;
  rows?: number;
}> = ({ placeholder, value, onChange, className = '', rows = 3 }) => (
  <textarea
    className={`flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    rows={rows}
  />
);

export const Select: React.FC<{
  children: React.ReactNode;
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLSelectElement>;
  className?: string;
  defaultValue?: string;
  required?: boolean;
  disabled?: boolean;
}> = ({ children, value, onChange, className = '', defaultValue, required, disabled }) => (
  <select
    className={`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    value={value}
    onChange={onChange}
    defaultValue={defaultValue}
    {...(required ? { required: true } : {})}
    {...(disabled ? { disabled: true } : {})}
  >
    {children}
  </select>
);

export const Modal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

// 폼 컴포넌트들
export const CompanyForm: React.FC<{
  company?: Company | null;
  onSubmit: (data: Omit<Company, 'id' | 'createdAt'>) => Promise<void> | void;
  onCancel: () => void;
}> = ({ company, onSubmit, onCancel }) => {
  // 탭 상태에 'summary' 추가
  const [tab, setTab] = useState<'info' | 'quotations' | 'contracts' | 'studies' | 'summary'>('info');

  // 회사 정보
  const [formData, setFormData] = useState({
    name: company?.name || '',
    address: company?.address || '',
    website: company?.website || '',
    mainPhoneNumber: company?.mainPhoneNumber || '',
    notes: company?.notes || '',
  });

  // 연락처
  const [contacts, setContacts] = useState<Contact[]>(company?.contacts || []);
  const [newContact, setNewContact] = useState<Omit<Contact, 'id'>>({
    name: '', email: '', phone: '', department: '', fax: '', isPrimary: false
  });

  // 견적
  const [quotations, setQuotations] = useState<Quotation[]>(company?.quotations || []);
  const [newQuotation, setNewQuotation] = useState<Omit<Quotation, 'id'>>({
    contactId: '', quotationNumber: '', quotationName: '', quotationAmount: '', discountRate: '', paymentTerms: ''
  });

  // 계약
  const [contracts, setContracts] = useState<Contract[]>(company?.contracts || []);
  const [newContract, setNewContract] = useState<Omit<Contract, 'id'>>({
    contactId: '', contractNumber: '', contractName: '', contractAmount: '', contractPeriodStart: '', contractPeriodEnd: '', contractSigningDate: '', paymentTerms: '', taxInvoiceIssued: false, taxInvoiceIssueDate: ''
  });

  // 연구
  const [studies, setStudies] = useState<Study[]>(company?.studies || []);
  const [newStudy, setNewStudy] = useState<Omit<Study, 'id'>>({
    contactId: '', studyNumber: '', studyName: '', studyDirector: '', studyPeriodStart: '', studyPeriodEnd: '', testingStandards: '', substanceInfo: '', submissionPurpose: ''
  });

  // 저장 상태
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // 연락처 Primary 유효성: 1명만 가능
  const handlePrimaryChange = (idx: number) => {
    setContacts(prev => prev.map((c, i) => ({ ...c, isPrimary: i === idx })));
  };

  // 연락처 추가
  const addContact = () => {
    if (!newContact.name.trim()) return;
    setContacts(prev => [
      ...prev,
      { ...newContact, id: Date.now().toString() }
    ]);
    setNewContact({ name: '', email: '', phone: '', department: '', fax: '', isPrimary: false });
  };
  // 연락처 삭제
  const removeContact = (id: string) => setContacts(prev => prev.filter(c => c.id !== id));

  // 견적 추가/삭제
  const addQuotation = () => {
    if (!newQuotation.quotationName.trim()) return;
    setQuotations(prev => [
      ...prev,
      { ...newQuotation, id: Date.now().toString() }
    ]);
    setNewQuotation({ contactId: '', quotationNumber: '', quotationName: '', quotationAmount: '', discountRate: '', paymentTerms: '' });
  };
  const removeQuotation = (id: string) => setQuotations(prev => prev.filter(q => q.id !== id));

  // 계약 추가/삭제
  const addContract = () => {
    if (!newContract.contractName.trim()) return;
    setContracts(prev => [
      ...prev,
      { ...newContract, id: Date.now().toString() }
    ]);
    setNewContract({ contactId: '', contractNumber: '', contractName: '', contractAmount: '', contractPeriodStart: '', contractPeriodEnd: '', contractSigningDate: '', paymentTerms: '', taxInvoiceIssued: false, taxInvoiceIssueDate: '' });
  };
  const removeContract = (id: string) => setContracts(prev => prev.filter(c => c.id !== id));

  // 연구 추가/삭제
  const addStudy = () => {
    if (!newStudy.studyName.trim()) return;
    setStudies(prev => [
      ...prev,
      { ...newStudy, id: Date.now().toString() }
    ]);
    setNewStudy({ contactId: '', studyNumber: '', studyName: '', studyDirector: '', studyPeriodStart: '', studyPeriodEnd: '', testingStandards: '', substanceInfo: '', submissionPurpose: '' });
  };
  const removeStudy = (id: string) => setStudies(prev => prev.filter(s => s.id !== id));

  // 유효성 검사
  const isValid = () => {
    if (!formData.name.trim() || !formData.address.trim()) return false;
    if (contacts.length === 0) return false;
    if (contacts.filter(c => c.isPrimary).length !== 1) return false;
    return true;
  };

  // 제출
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid()) {
      setSaveError('필수 입력값을 모두 입력하세요.');
      return;
    }
    if (saving) return;
    setSaving(true);
    setSaveError(null);
    try {
      console.log('저장 시도:', { ...formData, contacts, quotations, contracts, studies });
      // 저장 성공 시 피드백 먼저 보여주고, 1.5초 후 onSubmit 콜백 호출
      setShowSuccess(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      setShowSuccess(false);
      await Promise.resolve(onSubmit({
        ...formData,
        contacts,
        quotations,
        contracts,
        studies
      }));
      // 폼 초기화는 부모에서 처리(고객사 목록 이동 등)
    } catch (err: any) {
      setSaveError(err?.message || '저장에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row gap-12 bg-white rounded-xl shadow-lg p-10">
      {/* 입력 폼 */}
      <form onSubmit={handleSubmit} className="flex-1 min-w-[400px] space-y-6">
        {/* 탭 네비게이션 */}
        <div className="flex space-x-4 border-b mb-4">
          <span className={`py-2 px-4 font-semibold border-b-2 ${tab === 'info' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-gray-500'}`}>Client Info</span>
          <span className={`py-2 px-4 font-semibold border-b-2 ${tab === 'quotations' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-gray-500'}`}>Quotations</span>
          <span className={`py-2 px-4 font-semibold border-b-2 ${tab === 'contracts' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-gray-500'}`}>Contracts</span>
          <span className={`py-2 px-4 font-semibold border-b-2 ${tab === 'studies' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-gray-500'}`}>Studies</span>
        </div>
        {/* 탭별 내용 (기존 코드 그대로) */}
        {tab === 'info' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">회사명 *</label>
              <Input
                value={formData.name}
                onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="회사명을 입력하세요"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">주소 *</label>
              <Input
                value={formData.address}
                onChange={e => setFormData(prev => ({ ...prev, address: e.target.value }))}
                placeholder="주소를 입력하세요"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">웹사이트</label>
                <Input
                  value={formData.website}
                  onChange={e => setFormData(prev => ({ ...prev, website: e.target.value }))}
                  placeholder="https://example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">대표번호</label>
                <Input
                  value={formData.mainPhoneNumber}
                  onChange={e => setFormData(prev => ({ ...prev, mainPhoneNumber: e.target.value }))}
                  placeholder="02-1234-5678"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">메모</label>
              <Textarea
                value={formData.notes}
                onChange={e => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="추가 정보를 입력하세요"
              />
            </div>
            {/* 연락처 관리 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">연락처 *</label>
              <div className="space-y-4">
                {contacts.map((contact, idx) => (
                  <div key={contact.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">{contact.name}</h4>
                      <div className="flex items-center space-x-2">
                        <label className="flex items-center text-xs text-blue-700">
                          <input
                            type="radio"
                            checked={contact.isPrimary}
                            onChange={() => handlePrimaryChange(idx)}
                            className="mr-1"
                          />
                          주담당자
                        </label>
                        <Button variant="ghost" size="sm" onClick={() => removeContact(contact.id)}>
                          <TrashIcon className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                      {contact.email && <div>이메일: {contact.email}</div>}
                      {contact.phone && <div>전화: {contact.phone}</div>}
                      {contact.department && <div>부서: {contact.department}</div>}
                      {contact.fax && <div>팩스: {contact.fax}</div>}
                    </div>
                  </div>
                ))}
                {/* 새 연락처 추가 */}
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-3">새 연락처 추가</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <Input placeholder="이름" value={newContact.name} onChange={e => setNewContact(prev => ({ ...prev, name: e.target.value }))} />
                    <Input placeholder="이메일" value={newContact.email} onChange={e => setNewContact(prev => ({ ...prev, email: e.target.value }))} />
                    <Input placeholder="전화번호" value={newContact.phone} onChange={e => setNewContact(prev => ({ ...prev, phone: e.target.value }))} />
                    <Input placeholder="부서" value={newContact.department} onChange={e => setNewContact(prev => ({ ...prev, department: e.target.value }))} />
                    <Input placeholder="팩스" value={newContact.fax} onChange={e => setNewContact(prev => ({ ...prev, fax: e.target.value }))} />
                    <label className="flex items-center">
                      <input type="checkbox" checked={newContact.isPrimary} onChange={e => setNewContact(prev => ({ ...prev, isPrimary: e.target.checked }))} className="mr-2" />
                      주담당자
                    </label>
                  </div>
                  <Button type="button" onClick={addContact} className="mt-3">
                    <PlusIcon className="w-4 h-4 mr-2" />
                    연락처 추가
                  </Button>
                </div>
              </div>
              {/* 유효성 안내 */}
              {contacts.length === 0 && <div className="text-red-500 text-xs mt-2">연락처를 1명 이상 등록하세요.</div>}
              {contacts.filter(c => c.isPrimary).length !== 1 && <div className="text-red-500 text-xs mt-1">주담당자를 1명만 지정해야 합니다.</div>}
            </div>
          </div>
        )}
        {/* 견적 탭 */}
        {tab === 'quotations' && (
          <div className="space-y-4">
            {/* 기존 견적 목록 - 아코디언 */}
            {quotations.map((q, idx) => (
              <details key={q.id} className="border rounded-lg">
                <summary className="p-4 cursor-pointer flex justify-between items-center">
                  <span className="font-medium">{q.quotationName}</span>
                  <Button variant="ghost" size="sm" onClick={e => { e.stopPropagation(); removeQuotation(q.id); }}><TrashIcon className="w-4 h-4" /></Button>
                </summary>
                <div className="p-4 text-sm text-gray-600">
                  번호: {q.quotationNumber} <br />
                  금액: {q.quotationAmount} <br />
                  할인율: {q.discountRate || 0}% <br />
                  할인 적용 금액: {q.quotationAmount && q.discountRate ? (Number(q.quotationAmount.replace(/[^\d]/g, '')) * (1 - Number(q.discountRate) / 100)).toLocaleString() : '-'} <br />
                  지급 조건: {(() => {
                    if (!q.paymentTerms) return '-';
                    if (typeof q.paymentTerms === 'string') return q.paymentTerms;
                    // 객체일 경우 사람이 읽을 수 있게 변환
                    const pt = q.paymentTerms;
                    const adv = pt.advance ? `선금: ${Number(pt.advance).toLocaleString()}원` : '';
                    const ints = Array.isArray(pt.interims) && pt.interims.length > 0 ? pt.interims.map((v: string, i: number) => v ? `중도금${i + 1}: ${Number(v).toLocaleString()}원` : '').join(', ') : '';
                    const bal = pt.balance ? `잔금: ${Number(pt.balance).toLocaleString()}원` : '';
                    return [adv, ints, bal].filter(Boolean).join(', ');
                  })()}
                  <br />연락처: {contacts.find(c => c.id === q.contactId)?.name || '-'}
                </div>
              </details>
            ))}
            {/* 새 견적 입력 폼 */}
            <div className="border rounded-lg p-4 mt-2">
              <h4 className="font-medium mb-3">새 견적 추가</h4>
              <div className="grid grid-cols-2 gap-3">
                <Select value={newQuotation.contactId} onChange={e => setNewQuotation(prev => ({ ...prev, contactId: e.target.value }))}>
                  <option value="">연락처 선택</option>
                  {contacts.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </Select>
                <Input placeholder="견적명" value={newQuotation.quotationName} onChange={e => setNewQuotation(prev => ({ ...prev, quotationName: e.target.value }))} />
                <Input placeholder="견적번호" value={newQuotation.quotationNumber} onChange={e => setNewQuotation(prev => ({ ...prev, quotationNumber: e.target.value }))} />
                {/* 금액: 숫자만, 천단위 콤마 */}
                <div className="col-span-2 flex items-center gap-2">
                  <Input
                    placeholder="금액"
                    value={newQuotation.quotationAmount.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    onChange={e => {
                      const val = e.target.value.replace(/[^\d]/g, '');
                      setNewQuotation(prev => ({ ...prev, quotationAmount: val }));
                    }}
                    className="w-full"
                  />
                </div>
                {/* 할인율: % */}
                <div className="col-span-2 flex items-center gap-2">
                  <Input
                    placeholder="할인율"
                    value={newQuotation.discountRate}
                    onChange={e => {
                      const val = e.target.value.replace(/[^\d]/g, '');
                      setNewQuotation(prev => ({ ...prev, discountRate: val }));
                    }}
                    className="w-24"
                  />
                  <span className="text-gray-500">%</span>
                </div>
                {/* 할인 적용 금액 */}
                <div className="col-span-2 text-sm text-green-700">
                  할인 적용 금액: {newQuotation.quotationAmount && newQuotation.discountRate ?
                    (Number(newQuotation.quotationAmount) * (1 - Number(newQuotation.discountRate) / 100)).toLocaleString() : '-'}
                </div>
                {/* 지급 조건: 선금/중도금/잔금 */}
                <div className="col-span-2 space-y-2">
                  <div className="font-semibold text-xs mb-1">지급 조건</div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-16">선금</span>
                    <Input
                      placeholder="금액"
                      value={newQuotation.paymentTerms?.advance || ''}
                      onChange={e => setNewQuotation(prev => ({
                        ...prev,
                        paymentTerms: {
                          ...prev.paymentTerms,
                          advance: e.target.value.replace(/[^\d]/g, '')
                        }
                      }))}
                      className="w-32"
                    />
                  </div>
                  {/* 중도금(동적 추가) */}
                  {Array.isArray(newQuotation.paymentTerms?.interims) && newQuotation.paymentTerms.interims.map((amt: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-2 mb-1">
                      <span className="w-16">중도금{idx + 1}</span>
                      <Input
                        placeholder="금액"
                        value={amt}
                        onChange={e => setNewQuotation(prev => ({
                          ...prev,
                          paymentTerms: {
                            ...prev.paymentTerms,
                            interims: prev.paymentTerms.interims.map((v: string, i: number) => i === idx ? e.target.value.replace(/[^\d]/g, '') : v)
                          }
                        }))}
                        className="w-32"
                      />
                      <Button type="button" size="sm" variant="ghost" onClick={() => setNewQuotation(prev => ({
                        ...prev,
                        paymentTerms: {
                          ...prev.paymentTerms,
                          interims: prev.paymentTerms.interims.filter((_: string, i: number) => i !== idx)
                        }
                      }))}><TrashIcon className="w-4 h-4 text-red-400" /></Button>
                    </div>
                  ))}
                  <Button type="button" size="sm" variant="secondary" className="mb-2" onClick={() => setNewQuotation(prev => ({
                    ...prev,
                    paymentTerms: {
                      ...prev.paymentTerms,
                      interims: [...(prev.paymentTerms?.interims || []), '']
                    }
                  }))}>+ 중도금 추가</Button>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-16">잔금</span>
                    <Input
                      placeholder="금액"
                      value={newQuotation.paymentTerms?.balance || ''}
                      onChange={e => setNewQuotation(prev => ({
                        ...prev,
                        paymentTerms: {
                          ...prev.paymentTerms,
                          balance: e.target.value.replace(/[^\d]/g, '')
                        }
                      }))}
                      className="w-32"
                    />
                  </div>
                </div>
                {/* 지급 조건 합계 vs 할인 적용 금액 유효성 */}
                <div className="col-span-2 text-xs text-blue-700">
                  지급 조건 합계: {
                    (() => {
                      const adv = Number(newQuotation.paymentTerms?.advance || 0);
                      const ints = (newQuotation.paymentTerms?.interims || []).reduce((a: number, b: string) => a + Number(b || 0), 0);
                      const bal = Number(newQuotation.paymentTerms?.balance || 0);
                      return (adv + ints + bal).toLocaleString();
                    })()
                  } / 할인 적용 금액: {
                    newQuotation.quotationAmount && newQuotation.discountRate ?
                      (Number(newQuotation.quotationAmount) * (1 - Number(newQuotation.discountRate) / 100)).toLocaleString() : '-'
                  }
                </div>
                {/* 유효성 안내 */}
                {(() => {
                  const adv = Number(newQuotation.paymentTerms?.advance || 0);
                  const ints = (newQuotation.paymentTerms?.interims || []).reduce((a: number, b: string) => a + Number(b || 0), 0);
                  const bal = Number(newQuotation.paymentTerms?.balance || 0);
                  const total = adv + ints + bal;
                  const discounted = newQuotation.quotationAmount && newQuotation.discountRate ?
                    Number(newQuotation.quotationAmount) * (1 - Number(newQuotation.discountRate) / 100) : 0;
                  if (discounted && total !== discounted) {
                    return <div className="text-red-500">지급 조건 합계가 할인 적용 금액과 일치해야 합니다.</div>;
                  }
                  return null;
                })()}
              </div>
              <Button type="button" onClick={addQuotation} className="mt-3"><PlusIcon className="w-4 h-4 mr-2" />견적 추가</Button>
            </div>
          </div>
        )}
        {/* 계약 탭 */}
        {tab === 'contracts' && (
          <div className="space-y-4">
            {/* 기존 계약 목록 - 아코디언 */}
            {contracts.map((c, idx) => (
              <details key={c.id} className="border rounded-lg">
                <summary className="p-4 cursor-pointer flex justify-between items-center">
                  <span className="font-medium">{c.contractName}</span>
                  <Button variant="ghost" size="sm" onClick={e => { e.stopPropagation(); removeContract(c.id); }}><TrashIcon className="w-4 h-4" /></Button>
                </summary>
                <div className="p-4 text-sm text-gray-600">
                  번호: {c.contractNumber} <br />
                  금액: {c.contractAmount} <br />
                  기간: {c.contractPeriodStart}~{c.contractPeriodEnd} <br />
                  연락처: {contacts.find(ct => ct.id === c.contactId)?.name || '-'}
                </div>
              </details>
            ))}
            {/* 새 계약 입력 폼 */}
            <div className="border rounded-lg p-4 mt-2">
              <h4 className="font-medium mb-3">새 계약 추가</h4>
              <div className="grid grid-cols-2 gap-3">
                <Select value={newContract.quotationId || ''} onChange={e => {
                  const q = quotations.find(q => q.id === e.target.value);
                  setNewContract(prev => ({
                    ...prev,
                    quotationId: q?.id || '',
                    contractAmount: q && q.quotationAmount ? (Number(q.quotationAmount) * (1 - Number(q.discountRate || 0) / 100)).toString() : '',
                    paymentTerms: q?.paymentTerms || '',
                  }));
                }}>
                  <option value="">견적 선택 (견적명/견적번호)</option>
                  {quotations.map(q => <option key={q.id} value={q.id}>{q.quotationName} ({q.quotationNumber})</option>)}
                </Select>
                <Input placeholder="계약명" value={newContract.contractName} onChange={e => setNewContract(prev => ({ ...prev, contractName: e.target.value }))} />
                <Input placeholder="계약번호" value={newContract.contractNumber} onChange={e => setNewContract(prev => ({ ...prev, contractNumber: e.target.value }))} />
                {/* 금액: 견적 연동, 읽기 전용 */}
                <Input placeholder="금액 (견적에서 자동 연동)" value={newContract.contractAmount} readOnly className="bg-gray-100" />
                {/* 계약시작일 안내 */}
                <div className="col-span-2">
                  <label className="block text-xs text-gray-500 mb-1">계약 시작일 (실제 계약 효력 발생일)</label>
                  <Input placeholder="YYYY-MM-DD" value={newContract.contractPeriodStart} onChange={e => setNewContract(prev => ({ ...prev, contractPeriodStart: e.target.value }))} type="date" />
                </div>
                {/* 계약종료일 안내 */}
                <div className="col-span-2">
                  <label className="block text-xs text-gray-500 mb-1">계약 종료일 (계약 효력 만료일)</label>
                  <Input placeholder="YYYY-MM-DD" value={newContract.contractPeriodEnd} onChange={e => setNewContract(prev => ({ ...prev, contractPeriodEnd: e.target.value }))} type="date" />
                </div>
                {/* 계약체결일 안내 */}
                <div className="col-span-2">
                  <label className="block text-xs text-gray-500 mb-1">계약 체결일 (서명/날인일)</label>
                  <Input placeholder="YYYY-MM-DD" value={newContract.contractSigningDate} onChange={e => setNewContract(prev => ({ ...prev, contractSigningDate: e.target.value }))} type="date" />
                </div>
                {/* 지급조건: 견적 연동, 읽기 전용 */}
                <div className="col-span-2">
                  <label className="block text-xs text-gray-500 mb-1">지급 조건 (견적에서 자동 연동)</label>
                  <div className="bg-gray-50 border rounded px-3 py-2 text-sm text-gray-700 min-h-[36px]">
                    {(() => {
                      const pt = newContract.paymentTerms;
                      if (!pt) return '-';
                      if (typeof pt === 'string') return pt;
                      if (typeof pt === 'object' && pt !== null && 'interims' in pt && Array.isArray(pt.interims)) {
                        const adv = pt.advance ? `선금: ${Number(pt.advance).toLocaleString()}원` : '';
                        const ints = Array.isArray(pt.interims) && pt.interims.length > 0 ? pt.interims.map((v: string, i: number) => v ? `중도금${i + 1}: ${Number(v).toLocaleString()}원` : '').join(', ') : '';
                        const bal = pt.balance ? `잔금: ${Number(pt.balance).toLocaleString()}원` : '';
                        return [adv, ints, bal].filter(Boolean).join(', ');
                      }
                      return '-';
                    })()}
                  </div>
                </div>
                <label className="flex items-center">
                  <input type="checkbox" checked={newContract.taxInvoiceIssued} onChange={e => setNewContract(prev => ({ ...prev, taxInvoiceIssued: e.target.checked }))} className="mr-2" />
                  세금계산서 발행
                </label>
                {/* 세금계산서 발행 예정일: 계약체결일 + 30일 */}
                <div className="col-span-2 flex items-center gap-2">
                  <span className="text-gray-700">세금계산서 발행 예정일:</span>
                  <span className="text-blue-700 font-semibold">
                    {newContract.contractSigningDate ?
                      (() => {
                        const d = new Date(newContract.contractSigningDate);
                        d.setDate(d.getDate() + 30);
                        return d.toISOString().slice(0, 10);
                      })() : '(계약체결일 입력 시 자동 계산)'}
                  </span>
                </div>
              </div>
              <Button type="button" onClick={addContract} className="mt-3"><PlusIcon className="w-4 h-4 mr-2" />계약 추가</Button>
            </div>
          </div>
        )}
        {/* 연구 탭 */}
        {tab === 'studies' && (
          <div className="space-y-4">
            {/* 기존 연구 목록 - 아코디언 */}
            {studies.map((s, idx) => (
              <details key={s.id} className="border rounded-lg">
                <summary className="p-4 cursor-pointer flex justify-between items-center">
                  <span className="font-medium">{s.studyName}</span>
                  <Button variant="ghost" size="sm" onClick={e => { e.stopPropagation(); removeStudy(s.id); }}><TrashIcon className="w-4 h-4" /></Button>
                </summary>
                <div className="p-4 text-sm text-gray-600">
                  번호: {s.studyNumber} <br />
                  책임자: {s.studyDirector} <br />
                  기간: {s.studyPeriodStart}~{s.studyPeriodEnd} <br />
                  연락처: {contacts.find(ct => ct.id === s.contactId)?.name || '-'}
                </div>
              </details>
            ))}
            {/* 새 연구 입력 폼 */}
            <div className="border rounded-lg p-4 mt-2">
              <h4 className="font-medium mb-3">새 연구 추가</h4>
              <div className="grid grid-cols-2 gap-3">
                <Select value={newStudy.contactId} onChange={e => setNewStudy(prev => ({ ...prev, contactId: e.target.value }))}>
                  <option value="">연락처 선택</option>
                  {contacts.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </Select>
                <Input placeholder="연구명" value={newStudy.studyName} onChange={e => setNewStudy(prev => ({ ...prev, studyName: e.target.value }))} />
                <Input placeholder="연구번호" value={newStudy.studyNumber} onChange={e => setNewStudy(prev => ({ ...prev, studyNumber: e.target.value }))} />
                <Input placeholder="책임자" value={newStudy.studyDirector} onChange={e => setNewStudy(prev => ({ ...prev, studyDirector: e.target.value }))} />
                <Input placeholder="시작일" value={newStudy.studyPeriodStart} onChange={e => setNewStudy(prev => ({ ...prev, studyPeriodStart: e.target.value }))} type="date" />
                <Input placeholder="종료일" value={newStudy.studyPeriodEnd} onChange={e => setNewStudy(prev => ({ ...prev, studyPeriodEnd: e.target.value }))} type="date" />
                <Input placeholder="시험기준" value={newStudy.testingStandards} onChange={e => setNewStudy(prev => ({ ...prev, testingStandards: e.target.value }))} />
                <Input placeholder="물질정보" value={newStudy.substanceInfo} onChange={e => setNewStudy(prev => ({ ...prev, substanceInfo: e.target.value }))} />
                <Input placeholder="제출목적" value={newStudy.submissionPurpose} onChange={e => setNewStudy(prev => ({ ...prev, submissionPurpose: e.target.value }))} />
              </div>
              <Button type="button" onClick={addStudy} className="mt-3"><PlusIcon className="w-4 h-4 mr-2" />연구 추가</Button>
            </div>
          </div>
        )}
        {/* 하단 버튼 */}
        <div className="flex justify-between mt-8">
          {tab !== 'info' && (
            <Button type="button" variant="secondary" onClick={() => setTab(
              tab === 'quotations' ? 'info' :
                tab === 'contracts' ? 'quotations' :
                  tab === 'studies' ? 'contracts' : 'info')}>이전</Button>
          )}
          <div className="flex gap-2 ml-auto">
            {tab !== 'studies' && (
              <Button type="button" variant="primary" onClick={() => setTab(
                tab === 'info' ? 'quotations' :
                  tab === 'quotations' ? 'contracts' :
                    tab === 'contracts' ? 'studies' : 'studies')}>다음</Button>
            )}
            {tab === 'studies' && (
              <Button type="submit" variant="primary" disabled={!isValid() || saving}>
                {saving ? '저장 중...' : '저장'}
              </Button>
            )}
            <Button type="button" variant="ghost" onClick={onCancel}>취소</Button>
          </div>
        </div>
      </form>
      {/* 요약 폼 */}
      <div className="w-[400px] flex-shrink-0 ml-24">
        <Card className="p-4 shadow-md border border-gray-100 bg-gray-50 sticky top-8">
          <h3 className="font-semibold text-lg mb-2">입력 요약</h3>
          <div className="mb-2"><b>회사명:</b> {formData.name || <span className="text-gray-400">(미입력)</span>}</div>
          <div className="mb-2"><b>주소:</b> {formData.address || <span className="text-gray-400">(미입력)</span>}</div>
          <div className="mb-2"><b>대표번호:</b> {formData.mainPhoneNumber || <span className="text-gray-400">(미입력)</span>}</div>
          <div className="mb-2"><b>연락처:</b> {contacts.length === 0 ? <span className="text-gray-400">(없음)</span> : contacts.map(c => c.name).join(', ')}</div>
          <div className="mb-2"><b>견적:</b> {quotations.length}건</div>
          {quotations.length > 0 && <ul className="text-xs text-gray-600 mb-2 list-disc ml-4">{quotations.map(q => <li key={q.id}>{q.quotationName} ({q.quotationAmount})</li>)}</ul>}
          <div className="mb-2"><b>계약:</b> {contracts.length}건</div>
          {contracts.length > 0 && (
            <ul className="text-xs text-gray-600 mb-2 list-disc ml-4">
              {contracts.map(c => (
                <li key={c.id}>
                  {c.contractName} (
                  {c.contractAmount ? Number(c.contractAmount).toLocaleString() : '-'}원
                  {c.paymentTerms ?
                    (() => {
                      const pt = c.paymentTerms;
                      if (typeof pt === 'string') return `, 지급조건: ${pt}`;
                      if (typeof pt === 'object' && pt !== null && 'interims' in pt && Array.isArray(pt.interims)) {
                        const adv = pt.advance ? `선금: ${Number(pt.advance).toLocaleString()}원` : '';
                        const ints = Array.isArray(pt.interims) && pt.interims.length > 0 ? pt.interims.map((v: string, i: number) => v ? `중도금${i + 1}: ${Number(v).toLocaleString()}원` : '').join(', ') : '';
                        const bal = pt.balance ? `잔금: ${Number(pt.balance).toLocaleString()}원` : '';
                        return [adv, ints, bal].filter(Boolean).length > 0 ? `, 지급조건: ${[adv, ints, bal].filter(Boolean).join(', ')}` : '';
                      }
                      return '';
                    })() : ''}
                </li>
              ))}
            </ul>
          )}
          <div className="mb-2"><b>연구:</b> {studies.length}건</div>
          {studies.length > 0 && <ul className="text-xs text-gray-600 mb-2 list-disc ml-4">{studies.map(s => <li key={s.id}>{s.studyName} ({s.studyDirector})</li>)}</ul>}
        </Card>
      </div>
      {/* 저장 성공/실패 피드백 표시 */}
      {showSuccess && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-3 rounded shadow-lg animate-fade-in-out">저장되었습니다!</div>
      )}
      {saveError && (
        <div className="mt-4 text-red-500 text-sm">{saveError}</div>
      )}
    </div>
  );
};

export const MeetingForm: React.FC<{
  meeting?: Meeting | null;
  companies: Company[];
  onSubmit: (data: Omit<Meeting, 'id'>) => void;
  onCancel: () => void;
}> = ({ meeting, companies, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    companyId: meeting?.companyId || '',
    contactId: meeting?.contactId || '',
    title: meeting?.title || '',
    date: meeting?.date || '',
    attendees: meeting?.attendees || '',
    summary: meeting?.summary || '',
    actionItems: meeting?.actionItems || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const selectedCompany = companies.find(c => c.id === formData.companyId);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">고객사 *</label>
        <Select
          value={formData.companyId}
          onChange={(e) => setFormData(prev => ({ ...prev, companyId: e.target.value, contactId: '' }))}
          required
        >
          <option value="">고객사를 선택하세요</option>
          {companies.map(company => (
            <option key={company.id} value={company.id}>
              {company.name}
            </option>
          ))}
        </Select>
      </div>

      {selectedCompany && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">담당자</label>
          <Select
            value={formData.contactId}
            onChange={(e) => setFormData(prev => ({ ...prev, contactId: e.target.value }))}
          >
            <option value="">담당자를 선택하세요</option>
            {selectedCompany.contacts.map(contact => (
              <option key={contact.id} value={contact.id}>
                {contact.name} {contact.isPrimary ? '(주담당자)' : ''}
              </option>
            ))}
          </Select>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">미팅 제목 *</label>
        <Input
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          placeholder="미팅 제목을 입력하세요"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">날짜 *</label>
        <Input
          type="date"
          value={formData.date}
          onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">참석자</label>
        <Input
          value={formData.attendees}
          onChange={(e) => setFormData(prev => ({ ...prev, attendees: e.target.value }))}
          placeholder="참석자 목록을 입력하세요"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">미팅 요약</label>
        <Textarea
          value={formData.summary}
          onChange={(e) => setFormData(prev => ({ ...prev, summary: e.target.value }))}
          placeholder="미팅 내용을 요약하세요"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">액션 아이템</label>
        <Textarea
          value={formData.actionItems}
          onChange={(e) => setFormData(prev => ({ ...prev, actionItems: e.target.value }))}
          placeholder="액션 아이템을 입력하세요"
        />
      </div>

      <div className="flex justify-end space-x-3">
        <Button variant="secondary" onClick={onCancel}>
          취소
        </Button>
        <Button type="submit">
          {meeting ? '수정' : '추가'}
        </Button>
      </div>
    </form>
  );
};

export const TaskForm: React.FC<{
  task?: Task | null;
  companies: Company[];
  onSubmit: (data: Omit<Task, 'id'>) => void;
  onCancel: () => void;
}> = ({ task, companies, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    companyId: task?.companyId || '',
    contactId: task?.contactId || '',
    name: task?.name || '',
    description: task?.description || '',
    startDate: task?.startDate || '',
    endDate: task?.endDate || '',
    status: task?.status || TaskStatus.Pending,
    assignee: task?.assignee || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const selectedCompany = companies.find(c => c.id === formData.companyId);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">고객사 *</label>
        <Select
          value={formData.companyId}
          onChange={(e) => setFormData(prev => ({ ...prev, companyId: e.target.value, contactId: '' }))}
          required
        >
          <option value="">고객사를 선택하세요</option>
          {companies.map(company => (
            <option key={company.id} value={company.id}>
              {company.name}
            </option>
          ))}
        </Select>
      </div>

      {selectedCompany && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">담당자</label>
          <Select
            value={formData.contactId}
            onChange={(e) => setFormData(prev => ({ ...prev, contactId: e.target.value }))}
          >
            <option value="">담당자를 선택하세요</option>
            {selectedCompany.contacts.map(contact => (
              <option key={contact.id} value={contact.id}>
                {contact.name} {contact.isPrimary ? '(주담당자)' : ''}
              </option>
            ))}
          </Select>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">태스크명 *</label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          placeholder="태스크명을 입력하세요"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">설명</label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="태스크 설명을 입력하세요"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">시작일 *</label>
          <Input
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">종료일 *</label>
          <Input
            type="date"
            value={formData.endDate}
            onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">상태</label>
          <Select
            value={formData.status}
            onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as TaskStatus }))}
          >
            {Object.values(TaskStatus).map(status => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">담당자</label>
          <Input
            value={formData.assignee}
            onChange={(e) => setFormData(prev => ({ ...prev, assignee: e.target.value }))}
            placeholder="담당자명을 입력하세요"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <Button variant="secondary" onClick={onCancel}>
          취소
        </Button>
        <Button type="submit">
          {task ? '수정' : '추가'}
        </Button>
      </div>
    </form>
  );
};

// 견적/계약/연구 폼 최소 뼈대 컴포넌트 추가
export const QuotationForm: React.FC<{
  quotation?: Quotation | null;
  companyId: string;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}> = ({ quotation, companyId, onSubmit, onCancel }) => (
  <div className="space-y-4">
    <div className="text-gray-500">QuotationForm 구현 필요</div>
    <Button onClick={onCancel}>취소</Button>
  </div>
);

export const ContractForm: React.FC<{
  contract?: Contract | null;
  companyId: string;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}> = ({ contract, companyId, onSubmit, onCancel }) => (
  <div className="space-y-4">
    <div className="text-gray-500">ContractForm 구현 필요</div>
    <Button onClick={onCancel}>취소</Button>
  </div>
);

export const StudyForm: React.FC<{
  study?: Study | null;
  companyId: string;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}> = ({ study, companyId, onSubmit, onCancel }) => (
  <div className="space-y-4">
    <div className="text-gray-500">StudyForm 구현 필요</div>
    <Button onClick={onCancel}>취소</Button>
  </div>
);

// 차트 컴포넌트들
export const GanttChartRenderer: React.FC<{
  tasks: Task[];
  companies: Company[];
  onTaskClick?: (task: Task) => void;
}> = ({ tasks, companies, onTaskClick }) => {
  if (tasks.length === 0) {
    return <p className="text-center text-gray-500 py-8">No tasks to display in Gantt chart.</p>;
  }

  // 최근 15개만, 종료일 기준 내림차순
  const chartTasks = tasks
    .slice()
    .sort((a, b) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime())
    .slice(0, 15)
    .reverse();

  // Gantt용 데이터 변환
  const chartData = chartTasks.map(task => ({
    name: task.name,
    id: task.id,
    companyId: task.companyId,
    companyName: companies.find(c => c.id === task.companyId)?.name || 'Unknown',
    start: new Date(task.startDate).getTime(),
    end: new Date(task.endDate).getTime(),
    status: task.status,
    assignee: task.assignee || '',
    period: [new Date(task.startDate).getTime(), new Date(task.endDate).getTime()]
  }));

  const minDate = Math.min(...chartData.map(d => d.start));
  const maxDate = Math.max(...chartData.map(d => d.end));

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.Completed: return '#28A745';
      case TaskStatus.InProgress: return '#007BFF';
      case TaskStatus.Pending: return '#FFC107';
      case TaskStatus.Delayed: return '#DC3545';
      case TaskStatus.OnHold: return '#6C757D';
      default: return '#00A3BF';
    }
  };

  const CustomTooltipContent: React.FC<any> = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 shadow-lg rounded border border-gray-200 text-sm">
          <p className="font-semibold text-dark-text">{data.name}</p>
          <p className="text-medium-text">회사: {data.companyName}</p>
          <p className="text-medium-text">기간: {new Date(data.start).toLocaleDateString()} ~ {new Date(data.end).toLocaleDateString()}</p>
          <p className="text-medium-text">상태: <span style={{ color: getStatusColor(data.status) }}>{data.status}</span></p>
          {data.assignee && <p className="text-medium-text">담당자: {data.assignee}</p>}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-[500px] w-full bg-white p-4 rounded-lg shadow">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="vertical"
          data={chartData}
          margin={{ top: 20, right: 30, left: 100, bottom: 20 }}
          barCategoryGap="30%"
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis
            type="number"
            domain={[minDate, maxDate]}
            scale="time"
            tickFormatter={unixTime => new Date(unixTime).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
            allowDuplicatedCategory={false}
            className="text-xs"
          />
          <YAxis
            type="category"
            dataKey="name"
            width={120}
            interval={0}
            className="text-xs"
          />
          <Tooltip content={<CustomTooltipContent />} cursor={{ fill: 'rgba(200, 200, 200, 0.2)' }} />
          <Bar
            dataKey="period"
            minPointSize={5}
            onClick={data => {
              if (onTaskClick) {
                const task = tasks.find(t => t.id === data.id);
                if (task) onTaskClick(task);
              }
            }}
            cursor={onTaskClick ? "pointer" : undefined}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getStatusColor(entry.status)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const StatCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  trendDirection?: 'up' | 'down';
  unit?: string; // '₩' 등 단위
}> = ({ title, value, icon, trend, trendDirection, unit }) => {
  // 천단위 콤마
  const formattedValue = typeof value === 'number' ? value.toLocaleString() : value;
  return (
    <div className="flex items-center bg-white rounded-xl shadow p-5 min-w-[220px]">
      <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center bg-brand-primary/10 mr-4">
        <span className="text-brand-primary text-2xl">{icon}</span>
      </div>
      <div className="flex-1">
        <div className="text-sm text-medium-text font-semibold mb-1">{title}</div>
        <div className="text-2xl font-bold text-dark-text flex items-baseline">
          {unit && <span className="text-base mr-0.5">{unit}</span>}
          {formattedValue}
        </div>
        {trend && (
          <div className={`text-xs mt-1 font-medium flex items-center ${trendDirection === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {trendDirection === 'up' ? <span className="mr-1">▲</span> : <span className="mr-1">▼</span>}
            {trend}
          </div>
        )}
      </div>
    </div>
  );
};

export const UpcomingItemCard: React.FC<{
  item: Task | Meeting;
  type: 'task' | 'meeting';
  companyName?: string;
  contactName?: string;
  onClick?: () => void;
}> = ({ item, type, companyName, contactName, onClick }) => {
  const isTask = type === 'task';
  const taskItem = item as Task;
  const meetingItem = item as Meeting;

  const date = isTask ? new Date(taskItem.endDate) : new Date(meetingItem.date);
  const title = isTask ? taskItem.name : meetingItem.title;
  const status = isTask ? taskItem.status : undefined;

  const daysRemaining = Math.ceil((date.getTime() - new Date().getTime()) / (1000 * 3600 * 24));
  let urgencyColor = 'text-green-500';
  if (daysRemaining <= 0 && (!isTask || taskItem.status !== TaskStatus.Completed)) urgencyColor = 'text-red-500';
  else if (daysRemaining <= 3) urgencyColor = 'text-yellow-500';

  const statusBadgeStyles = isTask && status ? getUpcomingItemTaskStatusStyles(status) : 'bg-blue-100 text-blue-700';

  return (
    <div
      className="p-3 bg-slate-50 rounded-md shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <h4 className="font-semibold text-dark-text text-sm">{title}</h4>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusBadgeStyles}`}>
          {isTask ? status : 'Meeting'}
        </span>
      </div>
      {companyName && (
        <p className="text-xs text-brand-primary mt-1">{companyName}</p>
      )}
      {contactName && isTask && (
        <p className="text-xs text-slate-600 mt-0.5">Contact: {contactName}</p>
      )}
      <p className="text-xs text-medium-text mt-1">
        <CalendarDaysIcon className="inline w-3 h-3 mr-1" />
        {date.toLocaleDateString()}
        {daysRemaining <= 7 && daysRemaining > -30 && (
          <span className={`ml-2 font-semibold ${urgencyColor}`}>
            ({daysRemaining <= 0 && (!isTask || taskItem.status !== TaskStatus.Completed)
              ? `Overdue by ${Math.abs(daysRemaining)}d`
              : `${daysRemaining}d left`})
          </span>
        )}
      </p>
      {isTask && taskItem.assignee && <p className="text-xs text-light-text mt-0.5">Assignee: {taskItem.assignee}</p>}
    </div>
  );
};

function getUpcomingItemTaskStatusStyles(status: TaskStatus): string {
  switch (status) {
    case TaskStatus.Completed: return 'bg-green-100 text-green-700';
    case TaskStatus.InProgress: return 'bg-blue-100 text-blue-700';
    case TaskStatus.Pending: return 'bg-yellow-100 text-yellow-700';
    case TaskStatus.Delayed: return 'bg-red-100 text-red-700';
    case TaskStatus.OnHold: return 'bg-gray-100 text-gray-700';
    default: return 'bg-slate-100 text-slate-700';
  }
} 