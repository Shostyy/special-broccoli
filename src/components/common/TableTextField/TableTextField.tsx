import { TextField } from '@mui/material';
import { tableTextFieldStyles } from './styles/tableTextFieldStyle'
import { useTranslation } from 'react-i18next';
import { useState, useRef, useEffect } from 'react';

interface TableTextFieldProps {
    width?: number;
    handleFilterChange: (accessKey: string, newValue: string) => void;
    placeholderTranslationKey: string;
    accessorKey: string;
}

const TableTextField: React.FC<TableTextFieldProps> = ({
    width,
    handleFilterChange,
    placeholderTranslationKey,
    accessorKey
}) => {
    const { t } = useTranslation();
    const [filterValue, setFilterValue] = useState<string>('');
    const [placeholderWidth, setPlaceholderWidth] = useState<number | null>(null);
    const placeholderRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        if (placeholderRef.current) {
            setPlaceholderWidth(placeholderRef.current.offsetWidth);
        }
    }, [placeholderTranslationKey, t]);

    const placeholder = t(placeholderTranslationKey);

    return (
        <>
            <span
                ref={placeholderRef}
                style={{
                    visibility: 'hidden',
                    position: 'absolute',
                    whiteSpace: 'nowrap',
                    font: '16px Roboto, Helvetica, Arial, sans-serif',
                }}
            >
                {placeholder}
            </span>
            <TextField
                placeholder={placeholder}
                value={filterValue}
                variant='standard'
                onChange={(e) => {
                    handleFilterChange(accessorKey, e.target.value);
                    setFilterValue(e.target.value);
                }}
                sx={{
                    width: '100%',
                    minWidth: width ? `${width}px` : (placeholderWidth ? `${placeholderWidth + 20}px` : 'auto'),
                    ...tableTextFieldStyles
                }}
            />
        </>
    );
}

export default TableTextField;