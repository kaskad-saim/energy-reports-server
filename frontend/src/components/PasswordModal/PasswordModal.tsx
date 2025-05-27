// src/components/PasswordModal/PasswordModal.tsx
import React from 'react';
import Modal from 'react-modal';
import styles from './PasswordModal.module.scss';
import BtnDefault from '../../ui/BtnDefault/BtnDefault'; // ← импортируем кастомную кнопку

interface PasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  password?: string;
}

const DEFAULT_PASSWORD = '123'; // можно передавать пропсом или брать из env

const PasswordModal: React.FC<PasswordModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  password = DEFAULT_PASSWORD,
}) => {
  const [inputValue, setInputValue] = React.useState('');
  const [error, setError] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue === password) {
      setError('');
      onConfirm();
    } else {
      setError('Неверный пароль');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className={styles['password-modal']}
      overlayClassName={styles['password-modal-overlay']}
      contentLabel="Подтверждение паролем"
      ariaHideApp={false}
    >
      <h3>Введите пароль</h3>
      <form onSubmit={handleSubmit}>
        {error && <p className={styles['password-error']}>{error}</p>}
        <input
          type="password"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Пароль"
          className={styles['password-input']}
          autoFocus
        />
        <div className={styles['password-modal-buttons']}>
          <BtnDefault onClick={onClose} disabled={false} className={styles['btn-cancel']}>
            Отмена
          </BtnDefault>
          <BtnDefault onClick={handleSubmit} disabled={false} className={styles['btn-confirm']}>
            Подтвердить
          </BtnDefault>
        </div>
      </form>
    </Modal>
  );
};

export default PasswordModal;