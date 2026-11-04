import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  TextField,
  Popover,
  IconButton,
  Button,
  Select,
  MenuItem,
  InputAdornment,
} from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const WEEKDAY_NAMES = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

const formatToYMD = (year, month, day) => {
  const y = String(year).padStart(4, '0');
  const m = String(month + 1).padStart(2, '0');
  const d = String(day).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const formatDisplayDate = (ymdString) => {
  if (!ymdString || !/^\d{4}-\d{2}-\d{2}$/.test(ymdString)) return '';
  const [year, month, day] = ymdString.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  if (isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const BrandDatePicker = ({
  value = '',
  onChange,
  label = 'Date',
  minDate,
  maxDate,
  minYear = 2020,
  maxYear = new Date().getFullYear() + 1,
  size = 'small',
  error = false,
  helperText = '',
  sx = {},
}) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const parsedInitialDate = useMemo(() => {
    if (value && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      const [y, m, d] = value.split('-').map(Number);
      return { year: y, month: m - 1, day: d };
    }
    const today = new Date();
    return {
      year: Math.min(Math.max(today.getFullYear(), minYear), maxYear),
      month: today.getMonth(),
      day: today.getDate(),
    };
  }, [value, minYear, maxYear]);

  const [viewYear, setViewYear] = useState(parsedInitialDate.year);
  const [viewMonth, setViewMonth] = useState(parsedInitialDate.month);

  const handleOpen = (event) => {
    if (value && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      const [y, m] = value.split('-').map(Number);
      setViewYear(y);
      setViewMonth(m - 1);
    }
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const daysInMonth = useMemo(() => {
    return new Date(viewYear, viewMonth + 1, 0).getDate();
  }, [viewYear, viewMonth]);

  const firstDayOfWeek = useMemo(() => {
    return new Date(viewYear, viewMonth, 1).getDay();
  }, [viewYear, viewMonth]);

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      if (viewYear > minYear) {
        setViewYear(viewYear - 1);
        setViewMonth(11);
      }
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      if (viewYear < maxYear) {
        setViewYear(viewYear + 1);
        setViewMonth(0);
      }
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const handleDaySelect = (day) => {
    const ymd = formatToYMD(viewYear, viewMonth, day);
    if (onChange) onChange(ymd);
    handleClose();
  };

  const handleSelectToday = () => {
    const today = new Date();
    const todayYMD = formatToYMD(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );
    if (minDate && todayYMD < minDate) return;
    if (maxDate && todayYMD > maxDate) return;
    setViewYear(today.getFullYear());
    setViewMonth(today.getMonth());
    if (onChange) onChange(todayYMD);
    handleClose();
  };

  const handleClear = () => {
    if (onChange) onChange('');
    handleClose();
  };

  const yearOptions = useMemo(() => {
    const list = [];
    for (let y = minYear; y <= maxYear; y++) {
      list.push(y);
    }
    return list;
  }, [minYear, maxYear]);

  const todayStr = useMemo(() => {
    const now = new Date();
    return formatToYMD(now.getFullYear(), now.getMonth(), now.getDate());
  }, []);

  const open = Boolean(anchorEl);

  return (
    <Box sx={{ display: 'inline-block', ...sx }}>
      <TextField
        size={size}
        label={label}
        value={formatDisplayDate(value)}
        onClick={handleOpen}
        error={error}
        helperText={helperText}
        placeholder="Select date"
        sx={{ width: 175 }}
        InputProps={{
          readOnly: true,
          endAdornment: (
            <InputAdornment position="end">
              <CalendarMonthIcon
                sx={{
                  color: '#CA8A04',
                  fontSize: '1.25rem',
                  cursor: 'pointer',
                }}
              />
            </InputAdornment>
          ),
          sx: {
            cursor: 'pointer',
            bgcolor: '#FFFFFF',
            fontFamily: '"Montserrat", sans-serif',
            fontSize: '0.9rem',
            '& input': { cursor: 'pointer' },
            '&:hover fieldset': { borderColor: '#CA8A04' },
            '&.Mui-focused fieldset': { borderColor: '#1C1917' },
          },
        }}
        InputLabelProps={{
          shrink: true,
          sx: {
            fontFamily: '"Montserrat", sans-serif',
            color: '#78716C',
            '&.Mui-focused': { color: '#1C1917' },
          },
        }}
      />

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        PaperProps={{
          sx: {
            p: 2.5,
            width: 320,
            bgcolor: '#FAF9F6',
            borderRadius: '12px',
            border: '1px solid rgba(28, 25, 23, 0.1)',
            boxShadow: '0 16px 40px rgba(28, 25, 23, 0.14)',
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 2,
            gap: 1,
          }}
        >
          <IconButton
            size="small"
            onClick={handlePrevMonth}
            disabled={viewYear === minYear && viewMonth === 0}
            sx={{
              color: '#1C1917',
              '&:hover': { bgcolor: 'rgba(28, 25, 23, 0.06)' },
            }}
          >
            <ChevronLeftIcon fontSize="small" />
          </IconButton>

          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Select
              size="small"
              value={viewMonth}
              onChange={(e) => setViewMonth(Number(e.target.value))}
              variant="standard"
              disableUnderline
              MenuProps={{
                PaperProps: {
                  sx: {
                    maxHeight: 240,
                    zIndex: 1500,
                    bgcolor: '#FAF9F6',
                    borderRadius: '8px',
                    boxShadow: '0 8px 24px rgba(28, 25, 23, 0.12)',
                  },
                },
              }}
              sx={{
                fontFamily: '"Lora", serif',
                fontWeight: 600,
                fontSize: '1rem',
                color: '#1C1917',
                '& .MuiSelect-select': { py: 0.5, pr: 2 },
              }}
            >
              {MONTH_NAMES.map((name, idx) => (
                <MenuItem
                  key={name}
                  value={idx}
                  sx={{ fontFamily: '"Montserrat", sans-serif' }}
                >
                  {name}
                </MenuItem>
              ))}
            </Select>

            <Select
              size="small"
              value={viewYear}
              onChange={(e) => setViewYear(Number(e.target.value))}
              variant="standard"
              disableUnderline
              MenuProps={{
                PaperProps: {
                  sx: {
                    maxHeight: 240,
                    zIndex: 1500,
                    bgcolor: '#FAF9F6',
                    borderRadius: '8px',
                    boxShadow: '0 8px 24px rgba(28, 25, 23, 0.12)',
                  },
                },
              }}
              sx={{
                fontFamily: '"Lora", serif',
                fontWeight: 600,
                fontSize: '1rem',
                color: '#1C1917',
                '& .MuiSelect-select': { py: 0.5, pr: 2 },
              }}
            >
              {yearOptions.map((yr) => (
                <MenuItem
                  key={yr}
                  value={yr}
                  sx={{ fontFamily: '"Montserrat", sans-serif' }}
                >
                  {yr}
                </MenuItem>
              ))}
            </Select>
          </Box>

          <IconButton
            size="small"
            onClick={handleNextMonth}
            disabled={viewYear === maxYear && viewMonth === 11}
            sx={{
              color: '#1C1917',
              '&:hover': { bgcolor: 'rgba(28, 25, 23, 0.06)' },
            }}
          >
            <ChevronRightIcon fontSize="small" />
          </IconButton>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: 0.5,
            mb: 1,
            textAlign: 'center',
          }}
        >
          {WEEKDAY_NAMES.map((day) => (
            <Typography
              key={day}
              variant="caption"
              sx={{
                fontFamily: '"Montserrat", sans-serif',
                fontWeight: 700,
                color: '#78716C',
                fontSize: '0.75rem',
                py: 0.5,
              }}
            >
              {day}
            </Typography>
          ))}
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: 0.5,
          }}
        >
          {Array.from({ length: firstDayOfWeek }).map((_, idx) => (
            <Box key={`empty-${idx}`} />
          ))}

          {Array.from({ length: daysInMonth }).map((_, idx) => {
            const dayNum = idx + 1;
            const currentYMD = formatToYMD(viewYear, viewMonth, dayNum);
            const isSelected = value === currentYMD;
            const isToday = todayStr === currentYMD;

            let isDisabled = false;
            if (minDate && currentYMD < minDate) isDisabled = true;
            if (maxDate && currentYMD > maxDate) isDisabled = true;

            return (
              <Button
                key={`day-${dayNum}`}
                onClick={() => handleDaySelect(dayNum)}
                disabled={isDisabled}
                sx={{
                  minWidth: 0,
                  width: 36,
                  height: 36,
                  p: 0,
                  borderRadius: '8px',
                  fontFamily: '"Montserrat", sans-serif',
                  fontSize: '0.82rem',
                  fontWeight: isSelected ? 700 : isToday ? 600 : 500,
                  bgcolor: isSelected
                    ? '#1C1917'
                    : isToday
                      ? 'rgba(202, 138, 4, 0.12)'
                      : 'transparent',
                  color: isSelected
                    ? '#FFFFFF'
                    : isToday
                      ? '#CA8A04'
                      : '#1C1917',
                  border: isToday && !isSelected ? '1px solid #CA8A04' : 'none',
                  '&:hover': {
                    bgcolor: isSelected
                      ? '#1C1917'
                      : 'rgba(202, 138, 4, 0.16)',
                  },
                  '&.Mui-disabled': {
                    color: '#D6D3D1',
                  },
                }}
              >
                {dayNum}
              </Button>
            );
          })}
        </Box>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mt: 2,
            pt: 1.5,
            borderTop: '1px solid rgba(28, 25, 23, 0.08)',
          }}
        >
          <Button
            size="small"
            onClick={handleClear}
            sx={{
              fontFamily: '"Montserrat", sans-serif',
              textTransform: 'none',
              color: '#78716C',
              fontSize: '0.8rem',
              p: 0,
              minWidth: 'auto',
              '&:hover': { color: '#1C1917', bgcolor: 'transparent' },
            }}
          >
            Clear
          </Button>

          <Button
            size="small"
            onClick={handleSelectToday}
            sx={{
              fontFamily: '"Montserrat", sans-serif',
              textTransform: 'none',
              color: '#CA8A04',
              fontWeight: 600,
              fontSize: '0.8rem',
              p: 0,
              minWidth: 'auto',
              '&:hover': { color: '#A16207', bgcolor: 'transparent' },
            }}
          >
            Today
          </Button>
        </Box>
      </Popover>
    </Box>
  );
};

export default BrandDatePicker;
