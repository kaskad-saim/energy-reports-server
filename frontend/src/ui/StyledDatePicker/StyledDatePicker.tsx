// StyledDatePicker.tsx
import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ru } from 'date-fns/locale';
import styles from './StyledDatePicker.module.scss';

interface StyledDatePickerProps {
  selected?: Date | null;
  onChange: (date: Date | null) => void;
  placeholderText?: string;
  mode?: 'daily' | 'monthly';
}

const StyledDatePicker: React.FC<StyledDatePickerProps> = ({
  selected,
  onChange,
  placeholderText = 'Выберите дату',
  mode,
}) => {
  return (
    <div className={styles['styled-date-picker']}>
      <DatePicker
        selected={selected}
        onChange={onChange}
        dateFormat={mode === 'monthly' ? 'yyyy-MM' : 'yyyy-MM-dd'}
        showMonthYearPicker={mode === 'monthly'}
        placeholderText={placeholderText}
        locale={ru}
      />
    </div>
  );
};

export default StyledDatePicker;
