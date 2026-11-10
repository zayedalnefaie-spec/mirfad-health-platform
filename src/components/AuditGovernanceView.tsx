import React, { useState } from 'react';
import { 
  ShieldCheck, 
  FileText, 
  Download, 
  Lock, 
  CheckCircle2, 
  Search, 
  Filter, 
  History, 
  Hash, 
  Building2,
  ExternalLink
} from 'lucide-react';
import { AuditLogEntry } from '../types';

interface AuditGovernanceViewProps {
  logs: AuditLogEntry[];
}

export const AuditGovernanceView: React.FC<AuditGovernanceViewProps> = ({ logs }) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredLogs = logs.filter(log => {
    if (selectedFilter !== 'all' && log.category !== selectedFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchActor = log.actorName.toLowerCase().includes(q);
      const matchAction = log.action.toLowerCase().includes(q);
      const matchHosp = log.hospitalName.toLowerCase().includes(q);
      const matchHash = log.verificationHash.toLowerCase().includes(q);
      if (!matchActor && !matchAction && !matchHosp && !matchHash) return false;
    }
    return true;
  });

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `mirfad_audit_trail_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="bg-white p-5 rounded-xl border border-[#DFE9E9] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#087A5C] font-semibold mb-1">
            <Lock className="w-3.5 h-3.5" />
            <span>سجل الرقابة غير القابل للتعديل · بروتوكول سلامة العهدة الطبية (Chain of Custody)</span>
          </div>
          <h2 className="text-lg font-bold text-[#173B43]">سجل الحوكمة والتدقيق والامتثال التنظيمي</h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            توثيق كامل لكافة حركات الموارد، التوقيعات الرقمية، وتتبع درجات الحرارة بين المنشآت
          </p>
        </div>

        <button
          onClick={handleExportJSON}
          className="px-4 py-2 text-xs font-bold text-[#087A5C] bg-[#087A5C]/10 hover:bg-[#087A5C]/20 rounded-lg transition-colors flex items-center gap-2 cursor-pointer self-start md:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>تصدير تقرير التدقيق المعتمد (JSON)</span>
        </button>
      </div>

      {/* Governance & Regulatory Compliance Check Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-xl border border-[#DFE9E9] shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#173B43]">تكامل نظام رصد (SFDA Track & Trace)</span>
            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">جاهز للربط</span>
          </div>
          <p className="text-[11px] text-neutral-600 leading-relaxed">
            مطابقة حركة الأدوية والترياق الطارئ مع معايير الهيئة العامة للغذاء والدواء لضمان عدم ازدواجية الصرف.
          </p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-[#DFE9E9] shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#173B43]">حوكمة سلسلة التبريد للدم الحيوي</span>
            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">معتمد سريرياً</span>
          </div>
          <p className="text-[11px] text-neutral-600 leading-relaxed">
            تسجيل تيليمتري متواصل لدرجات حرارة نقل وحدات الدم والصفائح الدموية لمنع التلف قبل التسليم.
          </p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-[#DFE9E9] shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#173B43]">مصفوفة الصلاحيات الطبية (RBAC)</span>
            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">مفعلة</span>
          </div>
          <p className="text-[11px] text-neutral-600 leading-relaxed">
            حصر صلاحيات طلب الأجهزة الحساسة والدم على الاستشاريين ورؤساء الأقسام المصرح لهم في كل قطاع.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#DFE9E9] shadow-sm flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-neutral-400 absolute right-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث بالفاعل، المنشأة، الإجراء، أو رمز التحقق (Hash)..."
            className="w-full pr-9 pl-4 py-2 text-xs bg-[#F6F9F9] border border-[#DFE9E9] rounded-lg text-[#173B43] focus:outline-none focus:border-[#09AAA8]"
          />
        </div>

        <div className="w-full md:w-auto">
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="w-full md:w-48 py-2 px-3 text-xs bg-[#F6F9F9] border border-[#DFE9E9] rounded-lg text-[#173B43]"
          >
            <option value="all">كافة أحداث السجل ({logs.length})</option>
            <option value="request">إنشاء وبث الطلبات</option>
            <option value="offer">عروض المستشفيات والاعتماد</option>
            <option value="transit">سلسلة التبريد والنقل</option>
            <option value="receipt">فحص وتأكيد الاستلام</option>
            <option value="inventory">تحديثات المخزون والمعايرة</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-xl border border-[#DFE9E9] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-[#F6F9F9] border-b border-[#DFE9E9] text-[11px] font-bold text-neutral-600">
                <th className="py-3 px-4">الوقت والتاريخ</th>
                <th className="py-3 px-3">المسؤول / النظام</th>
                <th className="py-3 px-3">المنشأة</th>
                <th className="py-3 px-3">نوع الحدث</th>
                <th className="py-3 px-4">تفاصيل العملية</th>
                <th className="py-3 px-4 font-mono">بصمة التحقق (Audit Hash)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DFE9E9] text-xs">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-neutral-400">
                    لا توجد سجلات مطابقة للبحث
                  </td>
                </tr>
              ) : (
                filteredLogs.map(log => (
                  <tr key={log.id} className="hover:bg-neutral-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono text-[11px] text-neutral-600 whitespace-nowrap">
                      {log.timestamp}
                    </td>

                    <td className="py-3 px-3 whitespace-nowrap">
                      <div className="font-bold text-[#173B43]">{log.actorName}</div>
                      <div className="text-[10px] text-neutral-500">{log.actorRole}</div>
                    </td>

                    <td className="py-3 px-3 text-neutral-700 whitespace-nowrap">
                      {log.hospitalName}
                    </td>

                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-neutral-100 text-neutral-800">
                        {log.action}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-neutral-600 max-w-xs">
                      {log.details}
                    </td>

                    <td className="py-3 px-4 font-mono text-[10px] text-neutral-400 whitespace-nowrap">
                      {log.verificationHash}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
