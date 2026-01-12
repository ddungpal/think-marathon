'use client';

import React from 'react';
import { Input } from '@/components/ui/Input';
import { UseFormRegister, FieldError } from 'react-hook-form';

interface IncomeInputProps {
  register: UseFormRegister<any>;
  error?: FieldError;
}

export const IncomeInput: React.FC<IncomeInputProps> = ({ register, error }) => {
  return (
    <div>
      <Input
        label="월평균소득"
        type="number"
        min={0}
        step={1}
        {...register('monthly_income', { valueAsNumber: false })}
        error={error?.message}
        helperText="만 원 단위로 입력해주세요. (예: 500)"
      />
    </div>
  );
};

