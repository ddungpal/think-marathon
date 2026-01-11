'use client';

import React from 'react';
import { DiagnoseRequest } from '@/types/api';

interface InputSummaryProps {
  input: DiagnoseRequest;
}

export const InputSummary: React.FC<InputSummaryProps> = ({ input }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">입력 정보</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        <div>
          <div className="text-sm text-gray-500 mb-1">이름</div>
          <div className="text-lg font-semibold text-gray-900">{input.name}</div>
        </div>
        <div>
          <div className="text-sm text-gray-500 mb-1">나이</div>
          <div className="text-lg font-semibold text-gray-900">{input.age}세</div>
        </div>
        <div>
          <div className="text-sm text-gray-500 mb-1">직업</div>
          <div className="text-lg font-semibold text-gray-900">{input.job_type}</div>
        </div>
        <div>
          <div className="text-sm text-gray-500 mb-1">연차</div>
          <div className="text-lg font-semibold text-gray-900">{input.career_years}년</div>
        </div>
        <div>
          <div className="text-sm text-gray-500 mb-1">월평균소득</div>
          <div className="text-lg font-semibold text-gray-900">{input.monthly_income.toLocaleString()}만원</div>
        </div>
        <div>
          <div className="text-sm text-gray-500 mb-1">순자산</div>
          <div className="text-lg font-semibold text-gray-900">{input.net_worth.toLocaleString()}만원</div>
        </div>
      </div>
    </div>
  );
};

