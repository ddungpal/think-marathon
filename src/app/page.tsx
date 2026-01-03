import { DiagnosisForm } from '@/components/form/DiagnosisForm';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              생각 마라톤
            </h1>
            <p className="text-xl text-gray-600 mb-2">
              사전 질문 기반 진단 시스템
            </p>
            <p className="text-gray-500 max-w-2xl mx-auto">
              당신의 직업, 커리어, 소득, 자산을 기반으로 사고 패턴 중심의 구조화된 진단 결과를 제공합니다.
              <br />
              단순한 정보가 아닌, 깊은 사고를 촉발하는 진단을 경험해보세요.
            </p>
          </div>

          {/* Form Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
              진단 시작하기
            </h2>
            <DiagnosisForm />
          </div>

          {/* Info Section */}
          <div className="mt-12 text-center text-sm text-gray-500">
            <p>모든 정보는 진단 목적으로만 사용되며 저장되지 않습니다.</p>
          </div>
        </div>
      </div>
    </main>
  );
}

