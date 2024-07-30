import React, { useState } from 'react';
import { IconButton } from '@mui/material';
import NorthWestIcon from '@mui/icons-material/NorthWest';
import SouthEastIcon from '@mui/icons-material/SouthEast';
import Message from './components/Message';
import { useAppSelector } from '../../../types/hooks';

const PendingUpdates: React.FC = () => {
    const [isMessagesCollapsed, setIsMessagesCollapsed] = useState(false);

    // Define an object to store update messages and statuses dynamically
    const updates: { [key: string]: { updateMessage: string | null, updateStatus: 'idle' | 'pending' | 'success' | 'error' } } = {
        branchOffices: useAppSelector(state => state.branchOffices),
        customers: useAppSelector(state => state.customers),
        tradePoints: useAppSelector(state => state.tradePoints),
        categories: useAppSelector(state => state.categories),
        products: useAppSelector(state => state.products),
        prices: useAppSelector(state => state.prices),
        pricesForOrders: useAppSelector(state => state.pricesForOrders),
        productRemains: useAppSelector(state => state.productRemain),
        materials: useAppSelector(state => state.materials),
        models: useAppSelector(state => state.models),
        debts: useAppSelector(state => state.debts),
        commercialEquipment: useAppSelector(state => state.commercialEquipment),
        orders: useAppSelector(state => state.orders),
    };

    // Checking if any update status is not idle
    const hasPendingUpdates = Object.values(updates).some(update => update.updateStatus !== 'idle');

    return (
        <div className={'fixed bottom-0 right-0 m-2 transition-all block z-50'}>
            {/* Toggle button for collapsing/expanding messages */}
            {false && hasPendingUpdates && (
                <IconButton
                    className={'absolute -bottom-2 right-7'}
                    onClick={() => setIsMessagesCollapsed(!isMessagesCollapsed)}
                    aria-label={isMessagesCollapsed ? 'Collapse Messages' : 'Expand Messages'}
                >
                    {isMessagesCollapsed ? <NorthWestIcon /> : <SouthEastIcon />}
                </IconButton>
            )}

            {/* Display the messages */}
            {hasPendingUpdates && (
                Object.entries(updates).map(([sliceName, update]) => (
                    update.updateStatus !== 'idle' && update.updateMessage && (
                        <Message
                            key={sliceName}
                            isMessagesCollapsed={isMessagesCollapsed}
                            status={update.updateStatus}
                            message={update.updateMessage}
                        />
                    )
                ))
            )}
        </div>
    );
}

export default PendingUpdates;
