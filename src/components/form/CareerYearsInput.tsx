'use client';

import React from 'react';
import { Input } from '@/components/ui/Input';
import { UseFormRegister, FieldError } from 'react-hook-form';

interface CareerYearsInputProps {
  register: UseFormRegister<any>;
  error?: FieldError;
}

export const CareerYearsInput: React.FC<CareerYearsInputProps> = ({ register, error }) => {
  return (
    <Input
      label="연차"
      type="number"
      min={0}
      max={30}
      {...register('career_years', { valueAsNumber: false })}
      error={error?.message}
      helperText="0-30년 사이의 값을 입력해주세요."
    />
  );
};

