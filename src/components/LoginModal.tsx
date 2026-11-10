import React, { useState } from 'react';
import { 
  Building2, 
  Check, 
  KeyRound, 
  Lock, 
  ShieldAlert, 
  User, 
  Users, 
  X,
  Sparkles
} from 'lucide-react';
import { UserProfile } from '../types';
import { DEMO_USERS, HOSPITALS, HEALTH_SECTORS } from '../data/mockData';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onSelectUser: (user: UserProfile) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSelectUser
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'preset' | 'custom'>('preset');
  const [customName, setCustomName] = useState('');
  const [customRole, setCustomRole] = useState('طبيب استشاري طوارئ');
  const [customPin, setCustomPin] = useState('1234');
  const [customHospitalId, setCustomHospitalId] = useState(HOSPITALS[0].id);

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (customName.trim().length < 3) {
      alert('الرجاء إدخال اسم مستخدم مكون من 3 أحرف على الأقل.');
      return;
    }
    if (customPin.trim().length < 4) {
      alert('الرجاء إدخال رمز دخول تجريبي مكون من 4 خانات على الأقل.');
      return;
    }

    const selectedHosp = HOSPITALS.find(h => h.id === customHospitalId) || HOSPITALS[0];
    const selectedSector = HEALTH_SECTORS.find(s => s.id === selectedHosp.sectorId) || HEALTH_SECTORS[0];

    const newUser: UserProfile = {
      id: `user-custom-${Date.now()}`,
      name: customName.trim(),
      role: customRole,
      roleCategory: 'physician',
      hospitalId: selectedHosp.id,
      hospitalName: selectedHosp.nameAr,
      sectorId: selectedSector.id,
      sectorName: selectedSector.nameAr,
      avatarSeed: customName.trim()
    };

    onSelectUser(newUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-[#DFE9E9] max-w-lg w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-4 border-b border-[#DFE9E9] mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#087A5C] text-white flex items-center justify-center shadow-sm">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#173B43]">تبديل الحساب التجريبي والكادر المصرح</h3>
              <p className="text-xs text-neutral-500 mt-0.5">
                اختر حساباً جاهزاً أو أنشئ كادراً تجريبياً لاختبار أدوار المنظومة
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1 p-1 bg-[#F6F9F9] rounded-lg mb-4 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('preset')}
            className={`flex-1 py-1.5 rounded-md transition-all ${
              activeTab === 'preset' ? 'bg-white text-[#087A5C] font-bold shadow-xs' : 'text-neutral-500'
            }`}
          >
            حسابات تجريبية جاهزة (أدوار معتمدة)
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`flex-1 py-1.5 rounded-md transition-all ${
              activeTab === 'custom' ? 'bg-white text-[#087A5C] font-bold shadow-xs' : 'text-neutral-500'
            }`}
          >
            تسجيل دخول مخصص (اسم + رمز)
          </button>
        </div>

        {activeTab === 'preset' ? (
          <div className="space-y-2.5 max-h-80 overflow-y-auto">
            {DEMO_USERS.map((user) => {
              const isCurrent = currentUser.id === user.id;
              return (
                <div
                  key={user.id}
                  onClick={() => {
                    onSelectUser(user);
                    onClose();
                  }}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                    isCurrent 
                      ? 'border-[#087A5C] bg-[#087A5C]/5 ring-1 ring-[#087A5C]' 
                      : 'border-[#DFE9E9] hover:border-[#09AAA8] bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#087A5C] to-[#09AAA8] text-white font-bold flex items-center justify-center text-sm shadow-xs shrink-0">
                      {user.name.charAt(user.name.startsWith('د.') || user.name.startsWith('أ.') || user.name.startsWith('م.') ? 3 : 0)}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#173B43] flex items-center gap-1.5">
                        <span>{user.name}</span>
                        {isCurrent && <span className="text-[10px] text-[#087A5C] font-medium">(نشط حالياً)</span>}
                      </div>
                      <div className="text-[11px] text-neutral-600 line-clamp-1">{user.role}</div>
                      <div className="text-[10px] text-[#087A5C] font-semibold mt-0.5">{user.hospitalName}</div>
                    </div>
                  </div>

                  {isCurrent && (
                    <div className="w-6 h-6 rounded-full bg-[#087A5C] text-white flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <form onSubmit={handleCustomLogin} className="space-y-3.5 text-xs">
            <div>
              <label className="block font-bold text-neutral-700 mb-1">اسم عضو الكادر (3 أحرف فأكثر):</label>
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="مثال: Zayed أو د. صالح الغامدي"
                className="w-full p-2.5 bg-white border border-[#DFE9E9] rounded-lg text-[#173B43] font-semibold"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-neutral-700 mb-1">المسمى الوظيفي والدور:</label>
              <select
                value={customRole}
                onChange={(e) => setCustomRole(e.target.value)}
                className="w-full p-2.5 bg-white border border-[#DFE9E9] rounded-lg text-[#173B43]"
              >
                <option value="طبيب استشاري طوارئ وعناية حرجة">طبيب استشاري طوارئ وعناية حرجة</option>
                <option value="صيدلي أول مسؤول مخزون الأدوية">صيدلي أول مسؤول مخزون الأدوية</option>
                <option value="أخصائي مختبر وبنك الدم ومشتقاته">أخصائي مختبر وبنك الدم ومشتقاته</option>
                <option value="مهندس أجهزة طبية وسلاسل إمداد">مهندس أجهزة طبية وسلاسل إمداد</option>
                <option value="منسق سلاسل إمداد ونقل طبي">منسق سلاسل إمداد ونقل طبي</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-neutral-700 mb-1">المنشأة الصحية التابع لها:</label>
              <select
                value={customHospitalId}
                onChange={(e) => setCustomHospitalId(e.target.value)}
                className="w-full p-2.5 bg-white border border-[#DFE9E9] rounded-lg text-[#173B43]"
              >
                {HOSPITALS.map(h => (
                  <option key={h.id} value={h.id}>
                    {h.nameAr} ({HEALTH_SECTORS.find(s => s.id === h.sectorId)?.badge})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-neutral-700 mb-1">رمز الدخول التجريبي (4 خانات فأكثر):</label>
              <input
                type="password"
                value={customPin}
                onChange={(e) => setCustomPin(e.target.value)}
                placeholder="مثال: 1234"
                className="w-full p-2.5 bg-white border border-[#DFE9E9] rounded-lg font-mono text-[#173B43]"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 font-bold text-white bg-[#087A5C] hover:bg-[#06654c] rounded-lg shadow-sm transition-colors mt-2 cursor-pointer"
            >
              تسجيل الدخول وبدء الجلسة
            </button>
          </form>
        )}

        {/* Security Notice from Document Section 8 */}
        <div className="mt-4 pt-3 border-t border-[#DFE9E9] text-[11px] text-neutral-500 flex items-start gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <span>
            <strong>تنبيه توثيقي:</strong> تسجيل الدخول الحالي تجريبي (Prototype Mode) لأغراض الهاكثون واختبار الصلاحيات، ولا يمثل مصادقة سيبرانية نهائية للإنتاج.
          </span>
        </div>
      </div>
    </div>
  );
};
