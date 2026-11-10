import React, { useState } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  CheckCircle2, 
  Pill, 
  Truck, 
  ShieldCheck, 
  Building2,
  Activity
} from 'lucide-react';

interface SystemTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: string) => void;
}

export const SystemTourModal: React.FC<SystemTourModalProps> = ({
  isOpen,
  onClose,
  onNavigate
}) => {
  if (!isOpen) return null;

  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: 'أهلاً بك في منصة مِرفاد (MIRFAD)',
      subtitle: 'المنظومة الوطنية لتنسيق الموارد وسلاسل الإمداد الصحي التبادلي',
      icon: <Sparkles className="w-8 h-8 text-[#087A5C]" />,
      desc: 'صُممت مِرفاد لتمكين الكادر الصحي في المستشفيات والقطاعات المختلفة (الصحة، الحرس الوطني، الدفاع، الداخلية، والتخصصي) من التغلب على أزمات نقص الأدوية والمستلزمات والدم والأجهزة الحرجة عبر منصة رقمية موثقة وموحدة.',
      badge: 'الرؤية والهدف',
      viewTarget: 'dashboard'
    },
    {
      title: 'سجل المخزون الموحد متعدد الفئات',
      subtitle: 'أدوية، مستلزمات طبية، دم ومشتقاته، أجهزة طبية حرجة',
      icon: <Pill className="w-8 h-8 text-[#09AAA8]" />,
      desc: 'يمكنك استعراض المخزون في كافة المستشفيات المشاركة، وتصفية الأصناف الشحيحة التي وصلت لحد الأمان، ومعرفة اشتراطات سلسلة التبريد الدقيقة، وإنشاء طلب إمداد فوري بكبسة زر واحدة.',
      badge: 'المخزون الحي',
      viewTarget: 'inventory'
    },
    {
      title: 'رحلة طلب الإمداد وعروض الاستجابة',
      subtitle: 'بث النقص اللحظي، مقارنة العروض، وتأكيد الحجز',
      icon: <Activity className="w-8 h-8 text-[#087A5C]" />,
      desc: 'عند حدوث عجز حرج، يُبث الطلب لكافة المستشفيات المرشحة. تتنافس المنشآت القادرة لتقديم عروض بالكميات وزمن التجهيز، وتقوم المنشأة الطالبة باعتماد أفضل عرض ليتم حجز الكمية فوراً.',
      badge: 'دورة الطلب',
      viewTarget: 'requests'
    },
    {
      title: 'التتبع الميداني وسلسلة التبريد (IoT)',
      subtitle: 'مراقبة درجات الحرارة ومسار الشاحنة وزمن الوصول',
      icon: <Truck className="w-8 h-8 text-[#DDA745]" />,
      desc: 'تتبع لحظي للمركبة وسلسلة التبريد الحساسة لوحدات الدم والترياق الحيوي لضمان عدم تعرضها لتلف حراري، مع تتبع دقيق لبيانات المسعف والسيارة حتى الوصول لباب المنشأة.',
      badge: 'اللوجستيات الطبية',
      viewTarget: 'tracking'
    },
    {
      title: 'الحوكمة وسجل التدقيق وملف الهاكثون',
      subtitle: 'توثيق العهدة، الامتثال للغذاء والدواء، ومنهجية Biodesign',
      icon: <ShieldCheck className="w-8 h-8 text-[#087A5C]" />,
      desc: 'يوفر النظام سجلاً غير قابل للتلاعب (Audit Trail) لكافة العمليات ببصمات تحقق رقمية، مع ملف متكامل لمحكمي الهاكثون يوثق الأثر السريري والجدوى الاقتصادية وأعضاء الفريق.',
      badge: 'الحوكمة والابتكار',
      viewTarget: 'hackathon'
    }
  ];

  const current = steps[currentStep];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handleJumpToView = () => {
    onNavigate(current.viewTarget);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-[#DFE9E9] max-w-xl w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-[#DFE9E9] mb-4">
          <span className="text-xs font-bold text-[#087A5C] bg-[#087A5C]/10 px-2.5 py-0.5 rounded-full">
            {current.badge} ({currentStep + 1} من {steps.length})
          </span>
          <button 
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-600 p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="text-center py-4 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-neutral-50 border border-[#DFE9E9] mx-auto flex items-center justify-center shadow-xs">
            {current.icon}
          </div>

          <div>
            <h3 className="text-lg font-bold text-[#173B43]">{current.title}</h3>
            <p className="text-xs font-semibold text-[#09AAA8] mt-0.5">{current.subtitle}</p>
          </div>

          <p className="text-xs text-neutral-600 leading-relaxed max-w-md mx-auto">
            {current.desc}
          </p>
        </div>

        {/* Stepper dots */}
        <div className="flex items-center justify-center gap-1.5 py-2">
          {steps.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentStep(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === currentStep ? 'w-6 bg-[#087A5C]' : 'w-2 bg-neutral-200'
              }`}
            />
          ))}
        </div>

        {/* Actions */}
        <div className="pt-4 border-t border-[#DFE9E9] flex items-center justify-between">
          <button
            onClick={handleJumpToView}
            className="text-xs font-bold text-[#09AAA8] hover:underline"
          >
            الانتقال المباشر لهذه الشاشة
          </button>

          <div className="flex items-center gap-2">
            {currentStep > 0 && (
              <button
                onClick={() => setCurrentStep(currentStep - 1)}
                className="px-3 py-1.5 text-xs text-neutral-600 hover:bg-neutral-100 rounded-lg flex items-center gap-1"
              >
                <ChevronRight className="w-4 h-4" />
                <span>السابق</span>
              </button>
            )}

            <button
              onClick={handleNext}
              className="px-4 py-2 text-xs font-bold text-white bg-[#087A5C] hover:bg-[#06654c] rounded-lg shadow-sm flex items-center gap-1 cursor-pointer"
            >
              <span>{currentStep === steps.length - 1 ? 'إنهاء الجولة والبدء' : 'التالي'}</span>
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
