'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';

interface CurrentCapabilitiesProps {
  content: string;
}

export const CurrentCapabilities: React.FC<CurrentCapabilitiesProps> = ({ content }) => {
  return (
    <Card title="현재역량" className="mb-6">
      <div className="whitespace-pre-line text-gray-700 leading-relaxed">
        {content}
      </div>
    </Card>
  );
};

