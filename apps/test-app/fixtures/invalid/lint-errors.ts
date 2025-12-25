// This file has intentional linting errors
import { z } from 'zod';
import { something } from './nonexistent';
import { a } from 'a';

const unusedVariable = 'test';

export const testFunction = () => {
  const x: any = 5;
  return x;
};

export const noReturnType = (value: string) => {
  return value.toUpperCase();
};
