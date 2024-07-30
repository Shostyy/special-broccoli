import React from 'react';

interface ErrorSuccessModalProps {
    messageType: 'error' | 'success';
    message: string;
}

const ErrorSuccessModal: React.FC<ErrorSuccessModalProps> = ({ messageType, message }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
            <div className="bg-white p-8 rounded shadow-md">
                <div className={messageType === 'success' ? 'text-green-600' : 'text-red-600'}>
                    {message}
                </div>
            </div>
        </div>
    );
};

export default ErrorSuccessModal;
