'use client';

import React from 'react';
import { Input } from '@/components/ui/Input';
import { UseFormRegister, FieldError } from 'react-hook-form';

interface NameInputProps {
  register: UseFormRegister<any>;
  error?: FieldError;
}

export const NameInput: React.FC<NameInputProps> = ({ register, error }) => {
  return (
    <Input
      label="이름"
      type="text"
      {...register('name')}
      error={error?.message}
      helperText="이름을 입력해주세요."
    />
  );
};

