'use client';

import React from 'react';
import { Input } from '@/components/ui/Input';
import { UseFormRegister, FieldError } from 'react-hook-form';

interface AssetInputProps {
  register: UseFormRegister<any>;
  error?: FieldError;
}

export const AssetInput: React.FC<AssetInputProps> = ({ register, error }) => {
  return (
    <div>
      <Input
        label="순자산 (대출 제외)"
        type="number"
        min={0}
        step={1}
        {...register('net_worth', { valueAsNumber: false })}
        error={error?.message}
        helperText="만 원 단위로 입력해주세요. (예: 5000)"
      />
    </div>
  );
};

