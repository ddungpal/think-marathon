'use client';

import React, { useState } from 'react';
import { DiagnoseRequest } from '@/types/api';
import { StageInfo } from '@/types/output';

interface ShareButtonsProps {
  input: DiagnoseRequest;
  stage?: StageInfo | null;
}

export const ShareButtons: React.FC<ShareButtonsProps> = ({ input, stage }) => {
  const [copied, setCopied] = useState(false);

  const shareText = `${input.name}님의 진단 결과: ${stage?.label || '진단 완료'}
${stage?.description || ''}

생각 마라톤에서 확인해보세요!`;

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  const handleKakaoShare = () => {
    if (typeof window !== 'undefined' && (window as any).Kakao) {
      (window as any).Kakao.Share.sendDefault({
        objectType: 'feed',
        content: {
          title: `${input.name}님의 진단 결과`,
          description: `${stage?.label || '진단 완료'} - ${stage?.description || ''}`,
          imageUrl: '', // 이미지 URL 추가 가능
          link: {
            mobileWebUrl: shareUrl,
            webUrl: shareUrl,
          },
        },
      });
    } else {
      // 카카오 SDK가 없으면 기본 공유
      window.open(`https://story.kakao.com/share?url=${encodeURIComponent(shareUrl)}`);
    }
  };

  return (
    <div className="text-center">
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-[#191F28] mb-2">결과를 공유해보세요</h3>
        <p className="text-base text-[#8B95A1]">친구들과 나의 진단 결과를 공유해보세요!</p>
      </div>
      
      <div className="flex flex-wrap items-center justify-center gap-3">
        {/* 카카오톡 공유 */}
        <button
          onClick={handleKakaoShare}
          className="flex items-center justify-center gap-2 px-5 py-3 bg-[#FEE500] hover:bg-[#FDD835] text-[#191F28] rounded-2xl font-semibold transition-colors duration-200 active:scale-[0.98] min-w-[120px]"
        >
          <span className="text-xl">💬</span>
          <span className="text-base">카카오톡</span>
        </button>

        {/* 링크 복사 */}
        <button
          onClick={handleCopyLink}
          className="flex items-center justify-center gap-2 px-5 py-3 bg-[#F2F4F6] hover:bg-[#E5E8EB] text-[#191F28] rounded-2xl font-semibold transition-colors duration-200 active:scale-[0.98] min-w-[120px]"
        >
          <span className="text-xl">{copied ? '✓' : '🔗'}</span>
          <span className="text-base">{copied ? '복사됨!' : '링크 복사'}</span>
        </button>

        {/* 트위터 공유 */}
        <button
          onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`)}
          className="flex items-center justify-center gap-2 px-5 py-3 bg-[#1DA1F2] hover:bg-[#1A91DA] text-white rounded-2xl font-semibold transition-colors duration-200 active:scale-[0.98] min-w-[120px]"
        >
          <span className="text-xl">🐦</span>
          <span className="text-base">트위터</span>
        </button>

        {/* 페이스북 공유 */}
        <button
          onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`)}
          className="flex items-center justify-center gap-2 px-5 py-3 bg-[#1877F2] hover:bg-[#166FE5] text-white rounded-2xl font-semibold transition-colors duration-200 active:scale-[0.98] min-w-[120px]"
        >
          <span className="text-xl">📘</span>
          <span className="text-base">페이스북</span>
        </button>
      </div>
    </div>
  );
};

