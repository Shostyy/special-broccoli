import { createTheme } from '@mui/material/styles';

export const muiTheme = createTheme({
    palette: {
        primary: {
            main: '#c1585c',
        },
    },
    components: {
        MuiInputBase: {
            styleOverrides: {
                root: {
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
                input: {
                    padding: '0',
                    '&::-webkit-search-cancel-button': {
                        display: 'none',
                    },
                    '&::-ms-clear': {
                        display: 'none',
                    },
                    '&::-webkit-search-decoration': {
                        display: 'none',
                    },
                },
            },
        },
        MuiInput: {
            styleOverrides: {
                underline: {
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
            },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                notchedOutline: {
                    border: 'none',
                },
            },
        },
        MuiIconButton: {
            styleOverrides: {
                root: {
                    display: 'none',
                },
            },
        },
    },
});
