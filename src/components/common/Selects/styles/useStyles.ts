import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material';

interface StyleProps {
    width?: string | number;
    height?: string | number;
    fontSize?: string | number;
}

export const useStyles = makeStyles<Theme, StyleProps>(() => ({
    autocomplete: (props) => ({
        width: props.width || 300,
        '& .MuiOutlinedInput-root': {
            height: props.height || 'auto',
            fontSize: props.fontSize || 'inherit',
        },
        '& .MuiOutlinedInput-input': {
            height: '100%', // Ensure input takes the full height
            boxSizing: 'border-box',
        },
        '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
            borderColor: '#c25458', // Customize the border color
        },
        '& .MuiInputLabel-root': {
            color: '#000', // Default label color (black)
        },
        '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#c25458', // Customize the border color on focus
        },
        '& .MuiAutocomplete-option': {
            backgroundColor: '#c25458', // Customize the option background color
        },
        '& .MuiAutocomplete-option[data-focus="true"]': {
            backgroundColor: '#f8d7da', // Customize the focused option background color
        },
        '& .MuiAutocomplete-option[aria-selected="true"]': {
            backgroundColor: '#f8d7da', // Customize the selected option background color
        },
    }),
    autocompleteWhite: (props) => ({
        width: props.width || 400,
        '& .MuiOutlinedInput-root': {
            height: props.height || 'auto',
            fontSize: props.fontSize || 'inherit',
        },
        '& .MuiOutlinedInput-input': {
            height: '100%', // Ensure input takes the full height
            boxSizing: 'border-box',
        },
        '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
            borderColor: '#000', // Adjusted border color for visibility
            backgroundColor: '#fff', // White background
            opacity: '0.8',
        },
        '& .MuiInputBase-input': {
            color: '#000', // Ensure text color is visible
            opacity: 1, // Ensure input is fully visible
            textShadow: 'none', // Ensure no shadow affecting visibility
            zIndex: 1,
            /* Additional styles specific to your application */
        },
        '& .MuiInputLabel-root': {
            color: '#555', // Adjusted label color for visibility on white background
        },
        '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#555', // Adjusted border color on focus
        },
        '& .MuiAutocomplete-option': {
            backgroundColor: '#fff', // White background for options
            color: '#000', // Default text color for options
        },
        '& .MuiAutocomplete-option[data-focus="true"]': {
            backgroundColor: '#eee', // Adjusted background color of focused option
            color: '#000', // Adjusted text color of focused option
        },
        '& .MuiAutocomplete-option[aria-selected="true"]': {
            backgroundColor: '#f8d7da', // Customize the selected option background color
        },
    }),
}));
