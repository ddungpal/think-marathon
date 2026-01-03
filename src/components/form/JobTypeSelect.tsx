'use client';

import React from 'react';
import { Select } from '@/components/ui/Select';
import { UseFormRegister, FieldError } from 'react-hook-form';

interface JobTypeSelectProps {
  register: UseFormRegister<any>;
  error?: FieldError;
}

export const JobTypeSelect: React.FC<JobTypeSelectProps> = ({ register, error }) => {
  const options = [
    { value: '직장인', label: '직장인' },
    { value: '프리랜서/사업자', label: '프리랜서/사업자' },
  ];

  return (
    <Select
      label="직업"
      options={options}
      {...register('job_type')}
      error={error?.message}
      helperText="현재 직업 유형을 선택해주세요."
    />
  );
};

