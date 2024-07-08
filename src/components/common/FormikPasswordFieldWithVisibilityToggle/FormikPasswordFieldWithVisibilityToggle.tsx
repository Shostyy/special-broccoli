import React, { useState } from 'react';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { ErrorMessage, Field } from 'formik';
import { useTranslation } from 'react-i18next';

interface ShowHideWrapper {
    idAndName: string;
    placeholderTranslationKey: string;
    underlined?: boolean;
}

const FormikPasswordFieldWithVisibilityToggle: React.FC<ShowHideWrapper> = ({ idAndName, placeholderTranslationKey, underlined = false }) => {
    const [showPassword, setShowPassword] = useState(false);
    const { t } = useTranslation();

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const inputClasses = underlined
        ? "mt-1 block w-full px-4 py-3 border-b bg-transparent focus:outline-none focus:border-black sm:text-base border-b-2 border-gray-500"
        : "mt-1 block w-full px-4 py-3 border border-black rounded-md shadow-sm focus:outline-none focus:border-gray-300 sm:text-base";

    const buttonClasses = underlined
        ? "absolute inset-y-0 right-3 flex items-center text-gray-500"
        : "absolute inset-y-0 right-3 flex items-center px-3 text-gray-500";

    return (
        <>
            <div className="relative">
                <Field
                    type={showPassword ? "text" : "password"}
                    id={idAndName}
                    name={idAndName}
                    placeholder={t(placeholderTranslationKey)}
                    className={inputClasses}
                />
                <button
                    type="button"
                    className={buttonClasses}
                    onClick={togglePasswordVisibility}
                >
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        {showPassword ? <RemoveRedEyeIcon /> : <VisibilityOffIcon />}
                    </svg>
                </button>
            </div>
            <ErrorMessage name={idAndName} component="div" className="text-red-600 text-sm mt-1" />
        </>
    );
}

export default FormikPasswordFieldWithVisibilityToggle;