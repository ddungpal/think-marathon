'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';

interface CommonConcernsProps {
  content: string;
}

export const CommonConcerns: React.FC<CommonConcernsProps> = ({ content }) => {
  return (
    <Card title="공통고민" className="mb-6">
      <div className="whitespace-pre-line text-gray-700 leading-relaxed">
        {content}
      </div>
    </Card>
  );
};

