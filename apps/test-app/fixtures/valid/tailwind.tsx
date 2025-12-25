import type { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  onClick?: () => void;
}

export const Button = ({
  children,
  variant = 'primary',
  disabled = false,
  onClick,
}: ButtonProps) => {
  const baseClasses = 'rounded-lg px-4 py-2 font-medium transition-colors';
  const variantClasses =
    variant === 'primary'
      ? 'bg-blue-600 text-white hover:bg-blue-700'
      : 'bg-gray-200 text-gray-800 hover:bg-gray-300';
  const disabledClasses = disabled ? 'cursor-not-allowed opacity-50' : '';

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`${baseClasses} ${variantClasses} ${disabledClasses}`}
    >
      {children}
    </button>
  );
};

interface CardProps {
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}

export const Card = ({ title, children, footer }: CardProps) => {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-200 px-6 py-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="px-6 py-4">{children}</div>
      {footer && (
        <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
          {footer}
        </div>
      )}
    </div>
  );
};
