'use client';

import React from 'react';
import { Input } from '@/components/ui/Input';
import { UseFormRegister, FieldError } from 'react-hook-form';

interface AgeInputProps {
  register: UseFormRegister<any>;
  error?: FieldError;
}

export const AgeInput: React.FC<AgeInputProps> = ({ register, error }) => {
  return (
    <Input
      label="나이"
      type="number"
      min={0}
      max={70}
      {...register('age', { valueAsNumber: false })}
      error={error?.message}
      helperText="0-70세 사이의 값을 입력해주세요."
    />
  );
};

