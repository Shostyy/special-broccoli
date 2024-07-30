export const tableTextFieldStyles = {
    '& .MuiInputBase-root': {
      height: '32px',
      fontSize: '14px',
      padding: '0',
      backgroundColor: 'transparent',
      border: 'none',
      borderRadius: '0',
      boxShadow: 'none',
      '&:before': {
        borderBottom: '1px solid rgba(0, 0, 0, 0.42)',
        borderTop: 'none',
        borderLeft: 'none',
        borderRight: 'none',
      },
      '&:hover:not(.Mui-disabled):before': {
        borderBottom: '1px solid rgba(0, 0, 0, 0.87)',
      },
      '&:after': {
        borderBottom: '2px solid #c25458',
      },
    },
    '& .MuiInput-underline': {
      '&:before': {
        borderBottom: '1px solid rgba(0, 0, 0, 0.42)',
      },
      '&:hover:not(.Mui-disabled):before': {
        borderBottom: '1px solid rgba(0, 0, 0, 0.87)',
      },
      '&:after': {
        borderBottom: '2px solid #c25458',
      },
    },
    '& .MuiOutlinedInput-notchedOutline': {
      border: 'none',
    },
    '& .MuiInputBase-input': {
      padding: '0',
    },
  };