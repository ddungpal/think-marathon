import { DiagnosisForm } from '@/components/form/DiagnosisForm';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#F7F8FA]">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-2xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-[#191F28] mb-5 leading-tight">
              생각 마라톤
            </h1>
            <p className="text-xl md:text-2xl text-[#4E5968] mb-4 font-medium">
              사전 질문 기반 진단 시스템
            </p>
            <p className="text-base text-[#8B95A1] max-w-xl mx-auto leading-relaxed">
              당신의 직업, 커리어, 소득, 자산을 기반으로 사고 패턴 중심의 구조화된 진단 결과를 제공합니다.
            </p>
          </div>

          {/* Form Section */}
          <div className="bg-white rounded-3xl p-8 md:p-12">
            <DiagnosisForm />
          </div>

          {/* Info Section */}
          <div className="mt-10 text-center text-sm text-[#8B95A1]">
            <p>모든 정보는 진단 목적으로만 사용되며 저장되지 않습니다.</p>
          </div>
        </div>
      </div>
    </main>
  );
}

