import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styles from './StyledDatePicker.module.scss';

interface StyledDatePickerProps {
  selected?: Date | null;
  onChange: (date: Date | null) => void;
  placeholderText?: string;
}

const StyledDatePicker: React.FC<StyledDatePickerProps> = ({
  selected,
  onChange,
  placeholderText = 'Выберите дату',
}) => {
  return (
    <div className={styles['styled-date-picker']}>
      <DatePicker
        selected={selected}
        onChange={onChange}
        dateFormat="yyyy-MM-dd"
        placeholderText={placeholderText}
        locale="ru"
      />
    </div>
  );
};

export default StyledDatePicker;