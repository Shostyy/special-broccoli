import React, { useEffect } from 'react';

interface UnavailableProduct {
  productName: string;
  // Add other properties if needed
}

interface CustomErrorModalProps {
  unavailableList: UnavailableProduct[];
  onClose: () => void;
}

const CustomErrorModal: React.FC<CustomErrorModalProps> = ({ unavailableList, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative max-w-md">
        <strong className="font-bold">Наступні товари не доступні та були прибрані з вашого замовлення:</strong>
        <ul className="list-disc list-inside mt-2">
          {unavailableList.map((item, index) => (
            <li key={index} className="text-sm">{item.productName}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CustomErrorModal;