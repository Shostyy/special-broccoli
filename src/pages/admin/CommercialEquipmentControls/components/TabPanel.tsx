import React from 'react';

interface TabPanelProps {
    index: number;
    value: number;
    children: React.ReactNode;
}

const TabPanel: React.FC<TabPanelProps> = ({ index, value, children }) => {
    return (
        <div role="tabpanel" hidden={value !== index}>
            {value === index && children}
        </div>
    );
};

export default TabPanel;
