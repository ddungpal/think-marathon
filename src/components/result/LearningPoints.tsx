'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';

interface LearningPointsProps {
  content: string;
}

export const LearningPoints: React.FC<LearningPointsProps> = ({ content }) => {
  return (
    <Card title="학습포인트" className="mb-6">
      <div className="whitespace-pre-line text-gray-700 leading-relaxed">
        {content}
      </div>
    </Card>
  );
};

