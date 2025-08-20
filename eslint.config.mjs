// eslint.config.mjs
import tseslint from 'typescript-eslint';
import { FlatCompat } from '@eslint/eslintrc';
import path from 'path';
import { fileURLToPath } from 'url';

// Эмуляция `__dirname` для ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
});

export default tseslint.config(
  // Эта часть подключает плагин и его правила
  ...tseslint.configs.recommended,
  
  // Ваша конфигурация от Next.js
  ...compat.extends("next/core-web-vitals"),

  // Ваш кастомный объект для отключения правила
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    }
  }
);