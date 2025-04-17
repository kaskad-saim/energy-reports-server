import React from 'react';
import styles from './btnDefault.module.scss';

interface BtnDefaultProps {
  children?: React.ReactNode;
  isActive?: boolean;
  onClick?: () => void;
  icon?: React.ReactNode;
  borderRadius?: string;
  disabled?: boolean;
  iconSize?: string;
  className?: string;
}

const BtnDefault: React.FC<BtnDefaultProps> = ({
  children,
  isActive = false,
  onClick,
  icon,
  borderRadius,
  disabled = false,
  iconSize,
  className,
}) => {
  return (
    <button
      className={`${styles['btn-default']} ${isActive ? styles['active'] : ''} ${disabled ? styles['disabled'] : ''} ${className}`}
      onClick={disabled ? undefined : onClick}
      style={{ borderRadius }}
      disabled={disabled}
    >
      {icon && <span className={styles['btn-icon']} style={{ fontSize: iconSize }}>{icon}</span>}
      {children}
    </button>
  );
};

export default BtnDefault;
