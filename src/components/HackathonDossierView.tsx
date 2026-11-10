import React, { useState } from 'react';
import { 
  Award, 
  Sparkles, 
  Users, 
  FileText, 
  Target, 
  ShieldCheck, 
  TrendingUp, 
  Lightbulb, 
  Compass, 
  HelpCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export const HackathonDossierView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pitch' | 'biodesign' | 'team' | 'regulatory' | 'limits'>('pitch');

  return (
    <div className="space-y-6">
      {/* Dossier Header */}
      <div className="bg-gradient-to-l from-[#087A5C] via-[#09AAA8] to-[#173B43] text-white p-6 rounded-2xl shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#DDA745] font-bold mb-1">
              <Award className="w-4 h-4" />
              <span>ملف التحكيم الرسمي · هاكثون الابتكار الصحي السعودي (Medathon / Hackathon)</span>
            </div>
            <h1 className="text-xl md:text-2xl font-black">
              مِرفاد | MIRFAD - منصة التكامل والإمداد الصحي
            </h1>
            <p className="text-xs text-white/85 mt-1 max-w-2xl leading-relaxed">
              تنسيق الموارد الحرجة وسلاسل الإمداد الإسعافية التبادلية بين مستشفيات القطاعات الصحية المختلفة في المملكة العربية السعودية.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="px-3 py-1 bg-white/10 backdrop-blur rounded-lg text-xs font-mono font-bold text-white border border-white/20">
              MEDATHON 2026
            </span>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-white/20 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveTab('pitch')}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'pitch' ? 'bg-white text-[#087A5C] shadow-sm' : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            نص التقديم والعرض السريع (Pitch)
          </button>

          <button
            onClick={() => setActiveTab('biodesign')}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'biodesign' ? 'bg-white text-[#087A5C] shadow-sm' : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            منهجية Stanford Biodesign والأثر السريري
          </button>

          <button
            onClick={() => setActiveTab('team')}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'team' ? 'bg-white text-[#087A5C] shadow-sm' : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            فريق العمل المعتمد (Team)
          </button>

          <button
            onClick={() => setActiveTab('regulatory')}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'regulatory' ? 'bg-white text-[#087A5C] shadow-sm' : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            المسار التنظيمي (SFDA & Vision 2030)
          </button>

          <button
            onClick={() => setActiveTab('limits')}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'limits' ? 'bg-white text-[#087A5C] shadow-sm' : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            الحدود الحالية ونزاهة الدليل (Limitations)
          </button>
        </div>
      </div>

      {/* Tab 1: Pitch Deck Details */}
      {activeTab === 'pitch' && (
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-xl border border-[#DFE9E9] shadow-sm space-y-4">
            <h3 className="text-base font-bold text-[#173B43] flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#087A5C]" />
              <span>وصف المشروع المعتمد للهاكثون (أقل من 200 كلمة)</span>
            </h3>
            
            <div className="p-4 bg-[#F6F9F9] rounded-xl border border-[#DFE9E9] text-xs text-[#173B43] leading-relaxed">
              مِرفاد منصة رقمية موجهة للكادر الصحي لتنسيق الموارد بين المستشفيات المشاركة عند حدوث نقص. تتيح للمستخدمين المخولين معرفة توفر الأدوية والمستلزمات الطبية والدم ومشتقاته والأجهزة الطبية، ثم إنشاء طلب إمداد واستقبال عروض من المنشآت القادرة على الدعم. يوثق النظام مراحل الموافقة والتجهيز والنقل والاستلام، مع صلاحيات مختلفة حسب دور المستخدم وسجل للعمليات. يعرض النموذج التجريبي رحلة متكاملة باستخدام بيانات ومنشآت افتراضية أو أولية. المرحلة التالية المقترحة هي تنفيذ تجربة محدودة مع منشآت وأصناف مختارة، بعد اعتماد الحوكمة والصلاحيات واتفاقيات مشاركة البيانات والتكاملات الرسمية، لقياس زمن الاستجابة والاستفادة من المخزون مقارنة بخط أساس موثق.
            </div>

            <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-200 text-xs text-emerald-950 leading-relaxed font-mono">
              <div className="font-bold text-[#087A5C] mb-1 font-sans">English Elevator Pitch:</div>
              MIRFAD is a staff-only healthcare coordination platform designed to help participating hospitals respond to shortages of medicines, medical supplies, blood products, and equipment. Authorized staff can check available stock, request support from another facility, and track approvals, dispatch, and receipt through one documented workflow.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-xl border border-[#DFE9E9] shadow-sm space-y-2">
              <h4 className="font-bold text-sm text-[#D84E53] flex items-center gap-1.5">
                <Target className="w-4 h-4" />
                <span>المشكلة السريرية والتشغيلية (The Problem)</span>
              </h4>
              <p className="text-xs text-neutral-600 leading-relaxed">
                يعالج مِرفاد تشتت معرفة المخزون وآليات طلب الدعم بين المنشآت الصحية. عند حدوث نقص، يعتمد الكادر غالباً على اتصالات ورسائل وإجراءات متفرقة، ما يصعب معرفة المنشأة التي تملك مورداً متاحاً وتتبع الموافقات والنقل والاستلام الموثق.
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-[#DFE9E9] shadow-sm space-y-2">
              <h4 className="font-bold text-sm text-[#087A5C] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                <span>الحل المقترح ومحور الابتكار (The Innovation)</span>
              </h4>
              <p className="text-xs text-neutral-600 leading-relaxed">
                منظومة موحدة تربط 5 قطاعات صحية رئيسية (الصحة، الحرس الوطني، الدفاع، الداخلية، والتخصصي)، توفر سجل مخزون حي، وبث طلبات طارئة، وسلسلة تبريد ذكية، وفحص رسمي عند الاستلام دون الحاجة لاستبدال أنظمة المستشفيات الداخلية.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Biodesign & Clinical Impact */}
      {activeTab === 'biodesign' && (
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-xl border border-[#DFE9E9] shadow-sm space-y-4">
            <h3 className="text-base font-bold text-[#173B43] flex items-center gap-2">
              <Compass className="w-5 h-5 text-[#09AAA8]" />
              <span>تحليل منهجية Stanford Biodesign للاحتياجات السريرية غير الملباة</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 bg-[#F6F9F9] rounded-xl border border-[#DFE9E9] space-y-2">
                <div className="font-bold text-[#087A5C]">1. تحديد الاحتياج (Need Identification)</div>
                <p className="text-neutral-600 leading-relaxed">
                  وجود عجز حرج في أدوية الترياق النادرة أو وحدات الدم النادرة (O-) في طوارئ مستشفى، بينما يتوفر فائض صالح للاستخدام في مستشفى آخر على بعد كيلومترات في نفس المدينة دون وجود قناة ربط لحظية.
                </p>
              </div>

              <div className="p-4 bg-[#F6F9F9] rounded-xl border border-[#DFE9E9] space-y-2">
                <div className="font-bold text-[#09AAA8]">2. عبء المرض والتكلفة (Disease Burden & Cost)</div>
                <p className="text-neutral-600 leading-relaxed">
                  تأخر وصول الترياق أو جهاز الـ ECMO قد يؤدي إلى وفيات يمكن تفاديها أو إعاقات مستديمة، بالإضافة إلى التكلفة الباهظة للشراء الطارئ وإهدار الأدوية القريبة من انتهاء الصلاحية.
                </p>
              </div>

              <div className="p-4 bg-[#F6F9F9] rounded-xl border border-[#DFE9E9] space-y-2">
                <div className="font-bold text-[#DDA745]">3. التقييم المقارن (Standard of Care vs MIRFAD)</div>
                <p className="text-neutral-600 leading-relaxed">
                  الوضع الحالي: اتصالات هاتفية شخصية غير موثقة، عدم وضوح سلسلة العهدة، مخاطر تلف أثناء النقل دون تسجيل درجات الحرارة. مع مِرفاد: مسار رقمي موثق، موافقة سريرية، وتتبع حراري حي.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-[#DFE9E9] shadow-sm space-y-3">
            <h4 className="font-bold text-sm text-[#173B43]">عنصر الإبهار لمحكمي الهاكثون (Judges' WOW Factor)</h4>
            <div className="p-4 bg-teal-50/50 rounded-xl border border-teal-200 text-xs text-neutral-700 leading-relaxed space-y-2">
              <p>
                <strong>لماذا مِرفاد مختلف؟</strong> معظم حلول الهاكثونات تقترح بناء نظام تخطيط موارد جديد بالكامل أو تطبيق موجه للمرضى لا يحل جذور المشكلة. مِرفاد يركز على <strong>طبقة التنسيق التبادلي اللوجستي بين المنشآت (Inter-Facility Coordination Layer)</strong> مع تغطية سلسلة التبريد الدقيقة لحفظ الأرواح في اللحظات الحرجة.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Official Team Members */}
      {activeTab === 'team' && (
        <div className="bg-white p-6 rounded-xl border border-[#DFE9E9] shadow-sm space-y-5">
          <div>
            <h3 className="text-base font-bold text-[#173B43] flex items-center gap-2">
              <Users className="w-5 h-5 text-[#087A5C]" />
              <span>أعضاء فريق المشروع المعتمدون رسمياً في ملفات الهاكثون</span>
            </h3>
            <p className="text-xs text-neutral-500 mt-1">
              الأسماء المعتمدة في سجل المشروع النهائي، مع تجنب افتراض مسميات وظيفية غير موثقة:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-xl border border-[#DFE9E9] bg-[#F6F9F9] text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-[#087A5C] text-white text-xl font-bold mx-auto flex items-center justify-center shadow-sm">
                M
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#173B43]">Mohammed Nasrallah Khalifa Hassan</h4>
                <div className="text-xs text-neutral-500 mt-0.5">عضو الفريق ومبتكر رئيسي</div>
              </div>
              <div className="pt-2 border-t border-neutral-200 text-[11px] text-[#087A5C] font-semibold">
                عضو معتمد في هاكثون مِرفاد
              </div>
            </div>

            <div className="p-5 rounded-xl border border-[#DFE9E9] bg-[#F6F9F9] text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-[#09AAA8] text-white text-xl font-bold mx-auto flex items-center justify-center shadow-sm">
                M
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#173B43]">Muath Ahmed Alkurdi</h4>
                <div className="text-xs text-neutral-500 mt-0.5">عضو الفريق ومبتكر رئيسي</div>
              </div>
              <div className="pt-2 border-t border-neutral-200 text-[11px] text-[#09AAA8] font-semibold">
                عضو معتمد في هاكثون مِرفاد
              </div>
            </div>

            <div className="p-5 rounded-xl border border-[#DFE9E9] bg-[#F6F9F9] text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-[#DDA745] text-white text-xl font-bold mx-auto flex items-center justify-center shadow-sm">
                R
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#173B43]">Rayan Jahaz Alharbi</h4>
                <div className="text-xs text-neutral-500 mt-0.5">عضو الفريق ومبتكر رئيسي</div>
              </div>
              <div className="pt-2 border-t border-neutral-200 text-[11px] text-[#DDA745] font-semibold">
                عضو معتمد في هاكثون مِرفاد
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Regulatory Pathway */}
      {activeTab === 'regulatory' && (
        <div className="bg-white p-6 rounded-xl border border-[#DFE9E9] shadow-sm space-y-4">
          <h3 className="text-base font-bold text-[#173B43] flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#087A5C]" />
            <span>المسار التنظيمي ومعايير الهيئة العامة للغذاء والدواء (SFDA Pathway)</span>
          </h3>

          <div className="space-y-3 text-xs leading-relaxed text-neutral-700">
            <div className="p-4 bg-[#F6F9F9] rounded-xl border border-[#DFE9E9]">
              <h4 className="font-bold text-[#087A5C] text-sm mb-1">1. تصنيف المنصة (Software Classification)</h4>
              <p>
                تُصنف المنصة كنظام دعم لوجستي وتنسيقي للرعاية الصحية (Healthcare Logistics & Resource Allocation Platform)، وليست برمجية تشخيص سريري مباشر (Non-diagnostic SaMD). هذا يُسرع مسار الاعتماد التنظيمي عبر ضوابط التوزيع الجيد (Good Distribution Practice - GDP).
              </p>
            </div>

            <div className="p-4 bg-[#F6F9F9] rounded-xl border border-[#DFE9E9]">
              <h4 className="font-bold text-[#087A5C] text-sm mb-1">2. اشتراطات سلسلة التبريد ونقل الدم (Cold Chain & GxP Standards)</h4>
              <p>
                نقل الدم والأدوية الحيوية يخضع لضوابط الهيئة العامة للغذاء والدواء والمركز الوطني لنقل الدم. المنصة تفرض تسجيل القراءات الحرارية المشفرة لضمان صلاحية كل وحدة قبل اعتماد استلامها في المستشفى الطالب.
              </p>
            </div>

            <div className="p-4 bg-[#F6F9F9] rounded-xl border border-[#DFE9E9]">
              <h4 className="font-bold text-[#087A5C] text-sm mb-1">3. التوافق مع برنامج تحول القطاع الصحي (Saudi Vision 2030)</h4>
              <p>
                تحقيق كفاءة الإنفاق، تقليل الهدر في المخزون الدوائي، وتعزيز مرونة النظام الصحي الوطني في مواجهة الأزمات والحوادث الطارئة.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Limitations and Honest Evidence */}
      {activeTab === 'limits' && (
        <div className="bg-white p-6 rounded-xl border border-[#DFE9E9] shadow-sm space-y-4">
          <h3 className="text-base font-bold text-[#173B43] flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-[#DDA745]" />
            <span>الحدود الحالية ونزاهة الدليل العلمي (Honest Evidence & Boundaries)</span>
          </h3>

          <p className="text-xs text-neutral-600 leading-relaxed">
            وفقاً لتوثيق المشروع المعتمد، هذه النقاط الصريحة ضرورية لتقديم نموذج نزيه أمام لجان التحكيم والجهات الصحية:
          </p>

          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-lg bg-amber-50/60 border border-amber-200 text-amber-900">
              • <strong>النموذج تجريبي (Interactive Prototype):</strong> البيانات والمؤشرات المعروضة هي بيانات افتراضية لاختبار رحلة الاستخدام ولم تُجمع بعد بيانات ميدانية مثبتة.
            </div>
            <div className="p-3 rounded-lg bg-amber-50/60 border border-amber-200 text-amber-900">
              • <strong>عدم افتراض شراكات رسمية سابقة:</strong> ذكر أسماء المنشآت لا يعني وجود اتفاقيات تكامل رسمي حالياً؛ يتطلب التطبيق اتفاقيات حوكمة ومشاركة بيانات بين القطاعات.
            </div>
            <div className="p-3 rounded-lg bg-amber-50/60 border border-amber-200 text-amber-900">
              • <strong>المرحلة التالية الموصى بها:</strong> إجراء تجربة محدودة (Pilot Study) مع منشآت مختارة وأصناف منخفضة المخاطر لقياس زمن الاستجابة والوفر الفعلي مقارنة بخط أساس موثق.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
