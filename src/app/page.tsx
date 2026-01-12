import { DiagnosisForm } from '@/components/form/DiagnosisForm';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#F7F8FA]">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-2xl mx-auto">
          {/* Hero Section */}
          <div className="relative text-center mb-8 sm:mb-10 md:mb-12 overflow-hidden rounded-3xl min-h-[300px] sm:min-h-[350px] md:min-h-[400px] flex items-center justify-center">
            {/* 배경 이미지 (책을 읽는 손) */}
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: 'url(/images/book-background.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              {/* 어두운 오버레이로 텍스트 가독성 향상 */}
              <div className="absolute inset-0 bg-black/40"></div>
            </div>
            
            {/* 콘텐츠 - 완전 중앙 정렬 */}
            <div className="relative z-10 px-6 sm:px-8 md:px-12">
              <h1 
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-5 leading-tight"
                style={{
                  fontFamily: "'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                  color: '#FF1493', // 핫 핑크 색상 (ASTRA BOOK과 유사)
                  textShadow: '0 2px 8px rgba(255, 20, 147, 0.3)',
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                }}
              >
                생각 마라톤
              </h1>
              <p 
                className="text-base sm:text-lg md:text-xl lg:text-2xl mb-4 font-medium"
                style={{
                  fontFamily: "'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                  color: '#FF69B4', // 라이트 핑크 색상
                  textShadow: '0 1px 4px rgba(255, 105, 180, 0.2)',
                  fontWeight: 500,
                  letterSpacing: '-0.01em',
                }}
              >
                당신의 고민을 깊게 생각하는 시간
              </p>
            </div>
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

