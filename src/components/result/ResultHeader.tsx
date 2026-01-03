'use client';

import React from 'react';
import { DiagnoseRequest } from '@/types/api';

interface ResultHeaderProps {
  input: DiagnoseRequest;
}

export const ResultHeader: React.FC<ResultHeaderProps> = ({ input }) => {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">입력 정보</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div>
          <p className="text-gray-600 mb-1">직업</p>
          <p className="font-semibold text-gray-900">{input.job_type}</p>
        </div>
        <div>
          <p className="text-gray-600 mb-1">연차</p>
          <p className="font-semibold text-gray-900">{input.career_years}년</p>
        </div>
        <div>
          <p className="text-gray-600 mb-1">월평균소득</p>
          <p className="font-semibold text-gray-900">{input.monthly_income.toLocaleString()}만 원</p>
        </div>
        <div>
          <p className="text-gray-600 mb-1">순자산</p>
          <p className="font-semibold text-gray-900">{input.net_worth.toLocaleString()}만 원</p>
        </div>
      </div>
    </div>
  );
};

