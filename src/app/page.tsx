import { DiagnosisForm } from '@/components/form/DiagnosisForm';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#F7F8FA]">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-2xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#191F28] mb-5 leading-tight">
              생각 마라톤
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-[#4E5968] mb-4 font-medium">
              당신의 고민을 깊게 생각하는 시간
            </p>
          </div>

          {/* Form Section */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 md:p-12">
            <DiagnosisForm />
          </div>

          {/* Info Section */}
          <div className="mt-10 text-center text-sm text-[#8B95A1]">
            <p>생각하는 시간을 가질 수 있도록 도와드립니다.</p>
          </div>
        </div>
      </div>
    </main>
  );
}

