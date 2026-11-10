import React from 'react';
import { 
  Building2, 
  ChevronDown, 
  PlusCircle, 
  SlidersHorizontal,
  Bell,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { UserProfile } from '../types';

interface HeaderProps {
  currentUser: UserProfile;
  activeView: string;
  onNavigate: (view: string) => void;
  onOpenSupplyModal: () => void;
  onOpenLoginModal: () => void;
  onOpenTourModal: () => void;
  pendingRequestsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  activeView,
  onNavigate,
  onOpenSupplyModal,
  onOpenLoginModal,
  onOpenTourModal,
  pendingRequestsCount
}) => {
  const navItems = [
    { id: 'dashboard', label: 'لوحة التحكم' },
    { id: 'inventory', label: 'المخزون الموحد' },
    { id: 'requests', label: 'إدارة الطلبات والعروض' },
    { id: 'tracking', label: 'التتبع وسلسلة التبريد' },
    { id: 'directory', label: 'دليل المنشآت' },
    { id: 'audit', label: 'سجل الحوكمة والرقابة' },
    { id: 'hackathon', label: 'ملف الابتكار والهاكثون' }
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-[#DFE9E9]">
      {/* Sector & Environment Staff Banner */}
      <div className="bg-[#087A5C] text-white px-4 py-1 text-xs flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-bold tracking-wide">المنظومة الوطنية الموحدة لتنسيق الموارد الصحية</span>
          <span className="text-white/60">·</span>
          <span className="text-white/90">كادر صحي مصرح فقط (Staff Only)</span>
          <span className="text-white/60">·</span>
          <span className="text-[#DDA745] font-medium">نسخة تجريبية معتمدة للهاكثون</span>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={onOpenTourModal}
            className="flex items-center gap-1 text-xs text-white/90 hover:text-white transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>جولة تعريفية بالنظام</span>
          </button>
          <span className="text-white/40">|</span>
          <div className="flex items-center gap-1 text-xs text-emerald-100">
            <span className="w-2 h-2 rounded-full bg-[#09AAA8]"></span>
            <span>الربط الشبكي نشط (5 قطاعات)</span>
          </div>
        </div>
      </div>

      {/* Main One-Row Top Bar Contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0 cursor-pointer" onClick={() => onNavigate('dashboard')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#087A5C] to-[#09AAA8] flex items-center justify-center shadow-sm">
            <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-tight text-[#087A5C]">مِرفاد</span>
              <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-[#09AAA8]/10 text-[#09AAA8]">MIRFAD</span>
            </div>
            <span className="text-[11px] text-[#173B43]/70 font-medium">منصة التكامل والإمداد الصحي</span>
          </div>
        </div>

        {/* Zone 2: Navigation Links (Single-Line, whitespace-nowrap) */}
        <nav className="hidden lg:flex items-center gap-1 overflow-x-auto py-1">
          {navItems.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`relative px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap shrink-0 transition-colors ${
                  isActive 
                    ? 'text-[#087A5C] bg-[#087A5C]/10 font-bold' 
                    : 'text-[#173B43]/80 hover:text-[#087A5C] hover:bg-neutral-100/60'
                }`}
              >
                {item.label}
                {item.id === 'requests' && pendingRequestsCount > 0 && (
                  <span className="mr-1.5 inline-flex items-center justify-center px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-[#D84E53] text-white">
                    {pendingRequestsCount}
                  </span>
                )}
                {item.id === 'hackathon' && (
                  <span className="mr-1 inline-flex items-center text-[#DDA745]">
                    <Sparkles className="w-3 h-3 inline" />
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Action & Profile Switcher */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenSupplyModal}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-[#087A5C] hover:bg-[#06654c] rounded-lg shadow-sm transition-all whitespace-nowrap shrink-0 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>طلب إمداد فوري</span>
          </button>

          {/* User Profile Pill / Quick Switcher */}
          <button
            onClick={onOpenLoginModal}
            title="تبديل المستخدم أو المنشأة التجريبية"
            className="flex items-center gap-2 p-1.5 pr-2.5 rounded-lg border border-[#DFE9E9] hover:border-[#09AAA8] bg-[#F6F9F9] transition-all text-right"
          >
            <div className="w-7 h-7 rounded-full bg-[#087A5C] text-white font-bold text-xs flex items-center justify-center">
              {currentUser.name.charAt(currentUser.name.startsWith('د.') || currentUser.name.startsWith('أ.') || currentUser.name.startsWith('م.') ? 3 : 0)}
            </div>
            <div className="hidden sm:block text-right">
              <div className="text-xs font-bold text-[#173B43] leading-tight flex items-center gap-1">
                <span className="truncate max-w-[110px]">{currentUser.name}</span>
                <ChevronDown className="w-3 h-3 text-neutral-400" />
              </div>
              <div className="text-[10px] text-neutral-500 truncate max-w-[130px]">
                {currentUser.hospitalName.split('(')[0]}
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile nav bar for smaller viewports */}
      <div className="lg:hidden border-t border-[#DFE9E9] bg-white px-2 py-1.5 flex items-center gap-1 overflow-x-auto">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`px-2.5 py-1 text-xs rounded-md whitespace-nowrap shrink-0 ${
              activeView === item.id 
                ? 'bg-[#087A5C] text-white font-bold' 
                : 'text-[#173B43] hover:bg-neutral-100'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </header>
  );
};
