import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchClientFullResponse } from '../../../api/fetchClientFullResponse';
import { CustomerInfo } from '../../../api/types/customerInfo';
import { BASE_URL, END_OF_DAY } from '../../../data/constants/constants';
import { useAppDispatch, useAppSelector } from '../../../types/hooks';
import { CustomerData } from '../../../api/types/customerData';
import { fetchCustomersAsync } from '../../../redux/slices/customersSlice';
import { fetchAllDebtsAsync } from '../../../redux/slices/debtsSlice';
import { fetchTradePointAsync } from '../../../redux/slices/tradePointsSlice';
import { TradePointData } from '../../../api/types/tradePointData';
import { CommercialEquipment } from '../../../api/types/commercialEquipment';
import { fetchCommercialEquipmentAsync } from '../../../redux/slices/commercialEquipmentSlice';
import CustomerMultiSelect from '../../../components/common/Selects/CustomerMultiSelect';
import TradePointMultiSelect from '../../../components/common/Selects/TradePointMultiSelect';
import CommercialEquipmentMultiSelect from '../../../components/common/Selects/CommercialEquipmentMultiSelect';
import { GeneralButton } from '../../../components/common';
import { appIcons } from '../../../data/constants/icons';
import { CommercialEquipmentWithCounter } from '../../../api/types/commercialEquipmentWithCounter';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { PriceHistory } from '../../../api/types/PriceHistory';
import { uk } from 'date-fns/locale';
import { enUS } from 'date-fns/locale';
import ErrorSuccessModal from '../Users/components/ErrorSuccessModal/ErrorSuccessModal';
import EditIcon from '@mui/icons-material/Edit';
import SaveAsIcon from '@mui/icons-material/SaveAs';
import { GroupedData } from './types/groupedData';
import { PriceChange } from '../../../api/types/priceChange';
import { CommercialEquipmentCache } from './types/commercialEquipmentCache';

const CounterDrinkPrices: React.FC = () => {
    const { t, i18n } = useTranslation();
    const dispatch = useAppDispatch();
    const user = useAppSelector(state => state.login.userInfo);
    const { customers, loading } = useAppSelector(state => state.customers);
    const tradePoints = useAppSelector(state => state.tradePoints.tradePoints);
    const commercialEquipment = useAppSelector(state => state.commercialEquipment.commercialEquipment);
    const [userCustomers, setUserCustomers] = useState<CustomerInfo[] | null>(null);
    const [selectedCustomers, setSelectedCustomers] = useState<CustomerData[] | null>(null);
    const [selectedTradePoints, setSelectedTradePoints] = useState<TradePointData[] | null>(null);
    const [selectedEquipment, setSelectedEquipment] = useState<CommercialEquipment[] | null>(null);
    const [commercialEquipmentCache, setCommercialEquipmentCache] = useState<CommercialEquipmentCache>({});
    const [activeTab, setActiveTab] = useState<'Counters' | 'PriceChange' | 'PriceChangeHistory'>('Counters');
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedTradePoint, setSelectedTradePoint] = useState<TradePointData | null>(null);
    const [priceChanges, setPriceChanges] = useState<PriceChange[]>([]);
    const [allPriceHistory, setAllPriceHistory] = useState<PriceHistory[]>([]);
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const currentDatePickerLocale = useMemo(() => {
        return i18n.language === 'uk' ? uk : enUS;
    }, [i18n]);

    useEffect(() => {
        setTimeout(() => {
            setSuccessMessage(null);
        }, 2000);
    }, [successMessage]);

    useEffect(() => {
        setTimeout(() => {
            setErrorMessage(null);
        }, 2500);
    }, [errorMessage]);

    useEffect(() => {
        dispatch(fetchCustomersAsync());
        dispatch(fetchCommercialEquipmentAsync());
        dispatch(fetchTradePointAsync());
        dispatch(fetchAllDebtsAsync({}));

        fetchClientFullResponse.get<CustomerInfo[]>(`${BASE_URL}/api/users/user-customers`)
            .then((res) => {
                const onlyCurrentUserCustomer = res.data.filter(customer => customer.userId === user?.id);
                setUserCustomers(onlyCurrentUserCustomer);
            })
            .catch(err => {
                console.error(err);
                setErrorMessage("Failed to fetch user customers");
            });
    }, [dispatch, user]);

    const customersForSelect = useMemo(() => {
        if (!customers) return [];
        let filteredCustomers: CustomerData[] = [];
        if (user?.role.name === 'ADMIN' && (!userCustomers || userCustomers.length === 0)) {
            filteredCustomers = customers;
        } else if (userCustomers) {
            filteredCustomers = customers.filter(customer =>
                userCustomers.some(userCustomer => userCustomer.customerName === customer.name)
            );
        }
        return filteredCustomers;
    }, [customers, userCustomers, user]);

    const tradePointsForSelect = useMemo(() => {
        if (!selectedCustomers || selectedCustomers.length === 0) {
            return tradePoints?.filter(tp =>
                customersForSelect?.some(customer => customer.name === tp.customerName)
            );
        }
        return tradePoints?.filter(tp =>
            selectedCustomers.some(customer => customer.name === tp.customerName)
        );
    }, [tradePoints, customersForSelect, selectedCustomers]);

    const commercialEquipmentForSelect = useMemo(() => {
        if (!selectedTradePoints || selectedTradePoints.length === 0) {
            return commercialEquipment?.filter(ce =>
                tradePointsForSelect?.some(tp => tp.id === ce.tradePointId)
            );
        }
        return commercialEquipment?.filter(ce =>
            selectedTradePoints.some(tp => tp.id === ce.tradePointId)
        );
    }, [commercialEquipment, selectedTradePoints, tradePointsForSelect]);

    const handleSelectCustomer = (newCustomers: CustomerData[] | null) => {
        setSelectedCustomers(newCustomers);
        setSelectedTradePoints(null);
        setSelectedEquipment(null);
        setIsDataLoaded(false);
    };

    const handleSelectTradePoint = (newTradePoints: TradePointData[] | null) => {
        setSelectedTradePoints(newTradePoints);
        setSelectedEquipment(null);
        setIsDataLoaded(false);
    };

    const handleSelectCommercialEquipment = (newEquipment: CommercialEquipment[] | null) => {
        setSelectedEquipment(newEquipment);
        setIsDataLoaded(false);
    };

    const handleResetFilters = () => {
        setSelectedCustomers(null);
        setSelectedTradePoints(null);
        setSelectedEquipment(null);
        setCommercialEquipmentCache({});
        setIsDataLoaded(false);
    };

    const handleFormReport = async () => {
        if (!selectedCustomers || selectedCustomers.length === 0) {
            setErrorMessage("SelectCustomers");
            return;
        }

        if (tradePointsForSelect && tradePointsForSelect.length === 1) {
            setSelectedTradePoints(tradePointsForSelect);

            setSelectedTradePoint(tradePointsForSelect[0]);
        }

        if (commercialEquipmentForSelect && commercialEquipmentForSelect.length === 1) {
            setSelectedEquipment(commercialEquipmentForSelect);
        }

        setIsLoading(true);
        setErrorMessage(null);

        try {
            const newCache: CommercialEquipmentCache = {};
            for (const customer of selectedCustomers) {
                const customerTradePoints = tradePoints?.filter(tp =>
                    tp.customerName === customer.name &&
                    (!selectedTradePoints || selectedTradePoints.some(stp => stp.id === tp.id))
                ) || [];

                for (const tp of customerTradePoints) {
                    const response = await fetchClientFullResponse.get<CommercialEquipmentWithCounter[]>(
                        `${BASE_URL}/api/commercial-equipments/by-trade-point/${tp.id}`
                    );
                    newCache[tp.id] = response.data.filter(equipment =>
                        !selectedEquipment || selectedEquipment.some(se => se.id === equipment.id)
                    );
                }
            }
            setCommercialEquipmentCache(newCache);
            setIsDataLoaded(true);
        } catch (error) {
            console.error('Error fetching data:', error);
            setErrorMessage("Failed to fetch data. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        setPriceChanges([]);
        setSavedPriceChanges([]);
    }, [activeTab]);

    const handlePriceChange = (counterId: number, value: string) => {
        const regex = /^\d*\.?\d{0,2}$/;

        if (regex.test(value) || value === '') {
            const numericValue = value === '' ? 0 : parseFloat(value);

            setPriceChanges(prev => {
                const existingChangeIndex = prev.findIndex(change => change.counterId === counterId);
                if (existingChangeIndex > -1) {
                    const newChanges = [...prev];
                    newChanges[existingChangeIndex].price = numericValue;
                    return newChanges;
                } else {
                    const counter = commercialEquipmentCache[selectedTradePoint!.id]
                        .flatMap(ce => ce.equipmentCounters)
                        .find(c => c.counterId === counterId);
                    if (counter) {
                        return [...prev, {
                            drinkName: counter.counterName,
                            price: numericValue,
                            commercialEquipmentId: counter.commercialEquipmentId,
                            counterId: counter.counterId
                        }];
                    }
                    return prev;
                }
            });
        }
    };

    const [savedPriceChanges, setSavedPriceChanges] = useState<PriceChange[] | null>(null);

    const handleSaveChanges = async () => {
        setIsLoading(true);
        try {
            for (const change of priceChanges) {
                await fetchClientFullResponse.post(`${BASE_URL}/api/drink-prices`, change, 'application/json');
            }

            setSavedPriceChanges((prevSaved) => prevSaved ? [...prevSaved, ...priceChanges] : [...priceChanges]);

            setPriceChanges([]);

            await handleFormReport();

            setSuccessMessage('GeneralSuccess');
        } catch (error) {
            console.error('Error saving price changes:', error);
            setErrorMessage('GeneralError');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchPriceHistory = async () => {
        if (!commercialEquipmentForSelect) {
            setErrorMessage("Please ensure equipment is selected");
            return;
        }

        setIsLoading(true);
        setErrorMessage(null);

        try {
            const response = await fetchClientFullResponse.get<PriceHistory[]>(
                `${BASE_URL}/api/drink-prices`
            );
            setAllPriceHistory(response.data);
        } catch (error) {
            console.error('Error fetching price history:', error);
            setErrorMessage("Failed to fetch price history. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const tradePointListForToggle = selectedTradePoints ? selectedTradePoints : tradePointsForSelect;

    const groupedData: GroupedData = useMemo(() => {
        const data: GroupedData = {};

        if (selectedCustomers) {
            selectedCustomers.forEach(customer => {
                data[customer.id] = { customer, tradePoints: {} };

                const customerTradePoints = tradePointListForToggle?.filter(tp => tp.customerName === customer.name) || [];
                customerTradePoints.forEach(tp => {
                    data[customer.id].tradePoints[tp.id] = {
                        tradePoint: tp,
                        commercialEquipment: commercialEquipmentForSelect?.filter(ce => ce.tradePointId === tp.id) || []
                    };
                });
            });
        }

        return data;
    }, [selectedCustomers, tradePointsForSelect, commercialEquipmentForSelect]);


    const renderHierarchicalList = () => (
        <div className="w-1/2 p-6 overflow-y-auto" style={{ backgroundColor: '#dae1ec' }}>
            {Object.keys(groupedData).length > 0 ? (
                <>
                    {Object.values(groupedData).map(({ customer, tradePoints }) => (
                        <div key={customer.id} className="mb-4">
                            <h4 className="font-medium">{customer.name}</h4>
                            <div className="ml-4">
                                {Object.values(tradePoints).map(({ tradePoint, commercialEquipment }) => (
                                    <div key={tradePoint.id} className="ml-4 mb-2">
                                        <h6 className="font-medium">{tradePoint.name}</h6>
                                        <div className="ml-4">
                                            <ul className="list-disc ml-4">
                                                {commercialEquipment.map(ce => (
                                                    <li key={ce.id}>{ce.name}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </>
            ) : (
                <div className='flex justify-center'>{t('SelectCustomers')}</div>
            )}
        </div>
    );

    const renderCountersTab = () => (
        <div className="flex bg-white rounded-lg shadow-md overflow-hidden" style={{ height: '100%' }}>
            <div className="w-1/2 p-6 overflow-y-auto" style={{ backgroundColor: '#dae1ec' }}>
                {selectedCustomers || selectedTradePoints || selectedEquipment ? renderHierarchicalList() : (
                    <div className='flex justify-center'>{t('SelectCustomers')}</div>
                )}
            </div>
            <div className="w-3/5 p-6 overflow-y-auto flex flex-col">
                {isDataLoaded ? (
                    <div className="flex">
                        {/* Left column for trade points */}
                        <div className="w-1/3 pr-4 flex flex-col pt-4">
                            {tradePointListForToggle?.map(tp => (
                                <button
                                    key={tp.id}
                                    className={`mr-2 mb-2 px-4 py-2 border border-1 rounded-full ${selectedTradePoint?.id === tp.id ? 'border-red-600 text-red-500' : 'border-black text-black'
                                        }`}
                                    onClick={() => setSelectedTradePoint(tp)}
                                >
                                    {tp.name}
                                </button>
                            ))}
                        </div>
                        {/* Right column for selected trade point details and table */}
                        <div className="w-2/3">
                            {selectedTradePoint && (
                                <div className="container mx-auto p-4">
                                    <div className="rounded-md">
                                        {commercialEquipmentCache[selectedTradePoint.id]?.map((equipment) => (
                                            <div key={equipment.name} className="mb-4">
                                                <div className="font-semibold text-lg mb-2">{equipment.name}</div>
                                                <div className="grid grid-cols-3 gap-4 font-semibold rounded-t-md text-lg">
                                                    <div>{t('Name')}</div>
                                                    <div>{t('PriceUAH')}</div>
                                                    <div>{t('Author')}</div>
                                                </div>
                                                {equipment.equipmentCounters
                                                    .sort((a, b) => {
                                                        const nameA = a.latestPrice?.drinkName.toLowerCase() ?? '';
                                                        const nameB = b.latestPrice?.drinkName.toLowerCase() ?? '';

                                                        // If both names are empty, consider them equal
                                                        if (!nameA && !nameB) return 0;

                                                        // If only one name is empty, consider the non-empty name greater
                                                        if (!nameA) return 1;
                                                        if (!nameB) return -1;

                                                        // Otherwise, use localeCompare to compare the names
                                                        return nameA.localeCompare(nameB);
                                                    })
                                                    .map(counter => (
                                                        <div key={counter.counterId} className="grid grid-cols-3 gap-4 p-2 items-center" style={{ borderTop: '1px solid #E1E1E1' }}>
                                                            <div>{counter.counterName}</div>
                                                            <div>
                                                                <input
                                                                    type="text"
                                                                    value={counter.latestPrice?.price.toFixed(2) || ''}
                                                                    onChange={(e) => handlePriceChange(counter.counterId, e.target.value)}
                                                                    className="w-full p-1 border border-black rounded"
                                                                    disabled={true}
                                                                    style={{
                                                                        width: '115px',
                                                                        height: '44px',
                                                                        borderRadius: '5px',
                                                                        display: 'flex',
                                                                        justifyContent: 'center',
                                                                        alignItems: 'center',
                                                                        color: '#000',
                                                                        textAlign: 'center',
                                                                    }}
                                                                />
                                                            </div>
                                                            <div>{counter.latestPrice?.authorLogin || '-'}</div>
                                                        </div>
                                                    ))}
                                            </div>
                                        ))}
                                    </div>

                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <p className="text-center text-gray-500">
                        {!selectedCustomers ? t('SelectCustomers') : t('PressForm')}
                    </p>
                )}
            </div>
        </div>
    );

    const renderPriceChangeTab = () => (
        <div className="flex bg-white rounded-lg shadow-md overflow-hidden" style={{ height: '100%' }}>
            <div className="w-1/2 p-6 overflow-y-auto" style={{ backgroundColor: '#dae1ec' }}>
                {selectedCustomers || selectedTradePoints || selectedEquipment ? renderHierarchicalList() : (
                    <div className='flex justify-center'>{t('SelectCustomers')}</div>
                )}
            </div>
            <div className="w-3/5 p-6 overflow-y-auto flex flex-col">
                {isDataLoaded ? (
                    <div className="flex">
                        {/* Left column for trade points */}
                        <div className="w-1/3 pr-4 flex flex-col pt-4">
                            {tradePointListForToggle?.map(tp => (
                                <button
                                    key={tp.id}
                                    className={`mr-2 mb-2 px-4 py-2 border border-1 rounded-full ${selectedTradePoint?.id === tp.id ? 'border-red-600 text-red-500' : 'border-black text-black'}`}
                                    onClick={() => setSelectedTradePoint(tp)}
                                >
                                    {tp.name}
                                </button>
                            ))}
                        </div>
                        {/* Right column for selected trade point details and table */}
                        <div className="w-2/3">
                            {selectedTradePoint && (
                                <div className="container mx-auto p-4">
                                    <div className="rounded-md">
                                        {commercialEquipmentCache[selectedTradePoint.id]?.map((equipment) => (
                                            <div key={equipment.name} className="mb-4">
                                                {/* Render Equipment Name */}
                                                <div className="font-semibold text-lg mb-2">{equipment.name}</div>

                                                {/* Render Header for Price Changes */}
                                                <div className="grid grid-cols-3 gap-4 font-semibold rounded-t-md text-lg">
                                                    <div>{t('Name')}</div>
                                                    <div>{t('PriceUAH')}</div>
                                                </div>

                                                {/* Render Counters and Price Inputs */}
                                                {equipment.equipmentCounters
                                                    .sort((a, b) => {
                                                        const nameA = a.latestPrice?.drinkName.toLowerCase() ?? '';
                                                        const nameB = b.latestPrice?.drinkName.toLowerCase() ?? '';

                                                        // If both names are empty, consider them equal
                                                        if (!nameA && !nameB) return 0;

                                                        // If only one name is empty, consider the non-empty name greater
                                                        if (!nameA) return 1;
                                                        if (!nameB) return -1;

                                                        // Otherwise, use localeCompare to compare the names
                                                        return nameA.localeCompare(nameB);
                                                    })
                                                    .map(counter => (
                                                        <div key={counter.counterId} className="grid grid-cols-3 gap-4 p-2 items-center" style={{ borderTop: '1px solid #E1E1E1' }}>
                                                            <div>{counter.counterName}</div>
                                                            <div>
                                                                <input
                                                                    type="text"
                                                                    defaultValue={
                                                                        priceChanges.find(change => change.counterId === counter.counterId)?.price ||
                                                                        (counter.latestPrice?.price.toFixed(2) ?? '')
                                                                    }
                                                                    onChange={(e) => handlePriceChange(counter.counterId, e.target.value)}
                                                                    className="w-full p-1 border border-black rounded"
                                                                    style={{
                                                                        width: '115px',
                                                                        height: '44px',
                                                                        borderRadius: '5px',
                                                                        display: 'flex',
                                                                        justifyContent: 'center',
                                                                        alignItems: 'center',
                                                                        color: '#000',
                                                                        textAlign: 'center',
                                                                    }}
                                                                />

                                                            </div>
                                                            <div className="text-gray-500">
                                                                {priceChanges.some(change => change.counterId === counter.counterId) ? (
                                                                    <EditIcon />
                                                                ) : (
                                                                    savedPriceChanges?.some(saved => saved.counterId === counter.counterId) && (
                                                                        <SaveAsIcon />
                                                                    )
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>


                    </div>
                ) : (
                    <p className="text-center text-gray-500">{t('SelectCustomers')}</p>
                )}
            </div>


        </div>
    );

    const handleEndDateChange = (date: Date | null) => {
        if (date) {
            const endOfDay = new Date(date);
            endOfDay.setHours(...END_OF_DAY);
            setEndDate(endOfDay);
        } else {
            setEndDate(null);
        }
    };



    const renderHistoryTab = () => (
        <div className="flex bg-white rounded-lg shadow-md overflow-hidden" style={{ height: '100%' }}>
            <div className="w-1/2 p-6 overflow-y-auto relative" style={{ backgroundColor: '#dae1ec' }}>
                {selectedCustomers || selectedTradePoints || selectedEquipment ? (
                    <>
                        <h3 className="font-semibold mb-4 text-lg">{t('PriceChangeHistory')}</h3>
                        <div className="mt-4">
                            <div className="flex space-x-4">
                                <div className="flex mb-4 gap-4">
                                    <div>
                                        <DatePicker
                                            selected={startDate}
                                            onChange={(date) => setStartDate(date)}
                                            selectsStart
                                            startDate={startDate}
                                            endDate={endDate}
                                            placeholderText={t('StartDate')}
                                            className="p-2 border rounded"
                                            locale={currentDatePickerLocale}
                                        />
                                    </div>
                                    <div>
                                        <DatePicker
                                            selected={endDate}
                                            onChange={handleEndDateChange}
                                            selectsEnd
                                            startDate={startDate}
                                            endDate={endDate}
                                            minDate={startDate}
                                            placeholderText={t('EndDate')}
                                            className="p-2 border rounded"
                                            locale={currentDatePickerLocale}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        {renderHierarchicalList()}
                        <div className="flex flex-wrap pt-4">
                            {tradePointListForToggle?.map(tp => (
                                <button
                                    key={tp.id}
                                    className={`mr-2 w-auto mb-2 px-4 py-2 bg-white border border-1 rounded-full 
        ${selectedTradePoint?.id === tp.id ? 'border-red-600 text-red-500' : 'border-black text-black'}
        w-32 h-12 flex items-center justify-center`}
                                    onClick={() => setSelectedTradePoint(tp)}
                                >
                                    {tp.name}
                                </button>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className='flex justify-center'>{t('SelectCustomers')}</div>
                )}
                <div style={{ position: 'absolute', right: '10px', top: '10px' }}>
                    <GeneralButton
                        onClick={fetchPriceHistory}
                        disabled={isLoading}
                        translationKey='Download'
                    />
                </div>
            </div>
            <div className="w-3/5 p-6 overflow-y-auto">
                {Object.keys(filteredPriceHistory).length > 0 ? (
                    <div className="container mx-auto p-4">
                        {Object.entries(filteredPriceHistory).map(([equipmentId, { equipmentName, histories }]) => (
                            <div key={equipmentId} className="mb-8">
                                <h3 className="font-bold text-xl mb-4">{equipmentName}</h3>
                                <div className="bg-white p-4 rounded-md shadow">
                                    <div className="grid grid-cols-4 gap-4 font-semibold p-2 rounded-t-md text-lg">
                                        <div>{t('Name')}</div>
                                        <div>{t('PriceUAH')}</div>
                                        <div>{t('Author')}</div>
                                        <div>{t('EditDate')}</div>
                                    </div>
                                    {histories.map((history) => (
                                        <div key={history.id} className="grid grid-cols-4 gap-4 p-2 border-b last:border-b-0">
                                            <div>{history.drinkName}</div>
                                            <div
                                                style={{
                                                    width: '115px',
                                                    height: '44px',
                                                    backgroundColor: '#DAE1EC',
                                                    borderRadius: '5px',
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    color: '#7D7D7D'
                                                }}
                                            >
                                                <span>{history.price.toFixed(2)}</span>
                                            </div>
                                            <div>{history.authorLogin}</div>
                                            <div>{new Date(history.dateSet).toLocaleDateString()}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-500">
                        {allPriceHistory.length > 0 ? t('SearchNotFound') : t('SearchNotFound')}
                    </p>
                )}
            </div>
        </div>
    );

    const filteredPriceHistory = useMemo(() => {
        const filtered = allPriceHistory.filter(history => {
            const historyDate = new Date(history.dateSet);
            const isInDateRange = (!startDate || historyDate >= startDate) &&
                (!endDate || historyDate <= endDate);
            const isSelectedEquipment = commercialEquipmentForSelect?.some(ce => ce.id === history.commercialEquipmentId);
            const isSelectedTradePoint = selectedTradePoint
                ? commercialEquipmentForSelect?.some(ce =>
                    ce.id === history.commercialEquipmentId && ce.tradePointId === selectedTradePoint.id
                )
                : true;
            return isInDateRange && isSelectedEquipment && isSelectedTradePoint;
        });

        // Group the filtered history by commercialEquipmentId
        const grouped = filtered.reduce((acc, history) => {
            if (!acc[history.commercialEquipmentId]) {
                const equipment = commercialEquipment?.find(ce => ce.id === history.commercialEquipmentId);
                acc[history.commercialEquipmentId] = {
                    equipmentName: equipment?.name || 'Unknown Equipment',
                    histories: []
                };
            }
            acc[history.commercialEquipmentId].histories.push(history);
            return acc;
        }, {} as Record<number, { equipmentName: string, histories: PriceHistory[] }>);

        // Sort histories within each group by date (most recent first)
        Object.values(grouped).forEach(group => {
            group.histories.sort((a, b) => new Date(b.dateSet).getTime() - new Date(a.dateSet).getTime());
        });

        return grouped;
    }, [allPriceHistory, startDate, endDate, commercialEquipmentForSelect, selectedTradePoint, commercialEquipment]);


    if (loading) return <div>{t('Loading')}...</div>;

    return (
        <div style={{ height: '90%' }}>
            <div className="mb-4 flex justify-between overflow-hidden gap-2" style={{ height: '50px' }}>
                <div className='flex gap-2'>
                    <CustomerMultiSelect
                        customersList={customersForSelect || []}
                        onSelect={handleSelectCustomer}
                        height={50}
                        width={220}
                        color="red"
                        selectedCustomerList={selectedCustomers || []}
                    />
                    <TradePointMultiSelect
                        tradePointsList={tradePointsForSelect || []}
                        onSelect={handleSelectTradePoint}
                        height={50}
                        width={240}
                        color="red"
                        selectedTradePointList={selectedTradePoints || []}
                    />
                    <CommercialEquipmentMultiSelect
                        equipmentList={commercialEquipmentForSelect || []}
                        onSelect={handleSelectCommercialEquipment}
                        height={50}
                        width={240}
                        color="red"
                        selectedEquipmentList={selectedEquipment || []}
                    />
                </div>
                <div className='flex gap-2'>
                    <GeneralButton
                        onClick={handleResetFilters}
                        translationKey="ResetFilters"
                        icon={appIcons.closeRed}
                        width={180}
                    />
                    {activeTab !== 'PriceChangeHistory' && (
                        <GeneralButton
                            onClick={handleFormReport}
                            translationKey='Form'
                            icon={appIcons.addRed}
                            width={180}
                            disabled={isLoading || !selectedCustomers}
                        />
                    )}

                </div>
            </div>

            <div className="w-full bg-gray-100 p-4 flex flex-col rounded-xl" style={{ height: '100%' }}>
                <div className="flex-grow overflow-hidden rounded-xl">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-full">
                            <p>{t('Loading')}</p>
                        </div>
                    ) : (
                        <>
                            {activeTab === 'Counters' && renderCountersTab()}
                            {activeTab === 'PriceChange' && renderPriceChangeTab()}
                            {activeTab === 'PriceChangeHistory' && renderHistoryTab()}
                        </>
                    )}
                </div>

                <div className='flex justify-between'>
                    <nav className="flex justify-start pl-4 gap-2">
                        {['Counters', 'PriceChange', 'PriceChangeHistory'].map((tab) => (
                            <button
                                key={tab}
                                className={`py-2 px-4 font-medium text-sm ${activeTab === tab
                                    ? 'text-blue-600'
                                    : 'text-gray-500 hover:text-gray-700'
                                    }`}
                                onClick={() => setActiveTab(tab as 'Counters' | 'PriceChange' | 'PriceChangeHistory')}
                                style={{
                                    width: '190px',
                                    height: '80px',
                                    backgroundColor: `${activeTab === tab ? '#DAE1EC' : '#D9D9D9'}`,
                                    color: `${activeTab === tab ? '#C25458' : '#000'}`,
                                    fontSize: '16px',
                                    borderBottomRightRadius: '16px',
                                    borderBottomLeftRadius: '16px',
                                }}
                            >
                                {t(tab)}
                            </button>
                        ))}
                    </nav>
                    {activeTab === 'PriceChange' && (
                        <div className="mt-4 flex justify-center w-1/2 gap-2">
                            <GeneralButton
                                onClick={() => setPriceChanges([])}
                                translationKey='Cancel'
                                icon={appIcons.closeRed}
                                disabled={isLoading || !priceChanges.length}
                            />
                            <GeneralButton
                                onClick={handleSaveChanges}
                                translationKey='Save'
                                disabled={isLoading || !priceChanges.length}
                                icon={appIcons.addRed}
                            />
                        </div>
                    )}
                </div>
            </div>
            {successMessage && (
                <ErrorSuccessModal
                    messageType='success'
                    message={t(successMessage)}
                />
            )}
            {errorMessage && (
                <ErrorSuccessModal
                    messageType='error'
                    message={t(errorMessage)}
                />
            )}
        </div>
    );
};

export default CounterDrinkPrices;