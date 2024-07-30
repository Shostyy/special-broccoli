export const customDatePickerStyles = {
    '& .MuiInputBase-root': {
        height: '32px',
        fontSize: '12px',
        padding: '0 8px',
        border: '1px solid rgba(0, 0, 0, 0.23)', // Add this line
        borderRadius: '4px', // Add this line for rounded corners
    },
    '& .MuiInputBase-input': {
        padding: '4px 0',
        fontSize: '12px',
    },
    '& .MuiFormLabel-root': {
        fontSize: '14px',
        lineHeight: '1',
        backgroundColor: '#fff',
        padding: '0 3px',
        transform: 'translate(8px, 8px) scale(1)',
        '&.MuiInputLabel-shrink': {
            transform: 'translate(8px, -6px) scale(0.75)',
        },
    },
    '& .MuiOutlinedInput-notchedOutline': {
        border: 'none',
    },
    '&:hover .MuiInputBase-root': {
        borderColor: 'rgba(0, 0, 0, 0.23)',
    },
    '& .MuiInputBase-root.Mui-focused': {
        borderColor: '#c25458',
        borderWidth: '2px',
    },
    // Ensure calendar icon is visible
    '& .MuiIconButton-root': {
        display: 'block', // Ensure the icon is not hidden
    },
};
