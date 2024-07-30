import React from 'react';
import { useTranslation } from 'react-i18next';

interface ConfirmationModalProps {
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ message, onConfirm, onCancel }) => {
    const { t } = useTranslation();

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-75">
            <div className="bg-white p-4 rounded shadow-md w-1/3">
                <div className="text-lg font-medium">{t(message)}</div>
                <div className="flex justify-end mt-4">
                    <button
                        onClick={onConfirm}
                        className="text-white p-2 rounded w-40 mr-2"
                        style={{
                            backgroundColor: '#c25458',
                        }}
                    >
                        {t('Yes')}
                    </button>
                    <button
                        onClick={onCancel}
                        className="bg-gray-300 text-black p-2 rounded w-40"
                    >
                        {t('Cancel')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
