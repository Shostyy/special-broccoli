import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { CustomerInfo } from '../../../api/types/customerInfo';
import { useTranslation } from 'react-i18next';
import { ListboxComponent, StyledPopper } from './components/CommonComponents';
import { useStyles } from './styles/useStyles';

interface CustomerInfoSelectData {
    customersList: CustomerInfo[];
    onSelect: (selectedTradePoint: CustomerInfo | null) => void;
    color?: 'red' | 'white';
    width?: string | number;
    height?: string | number;
    fontSize?: string | number;
}

const CustomerInfoSelect: React.FC<CustomerInfoSelectData> = ({
    customersList,
    onSelect,
    color = 'red',
    width,
    height,
    fontSize
}) => {
    const { t } = useTranslation();

    const customerMap = React.useMemo(() => {
        const map = new Map<string, CustomerInfo>();
        customersList.forEach(customer => map.set(customer.customerName, customer));
        return map;
    }, [customersList]);

    const preparedList = customersList.map(customer => customer.customerName);

    const classes = useStyles({width, height, fontSize});

    const noOptionsText = t('SearchNotFound');

    return (
        <Autocomplete
            disableListWrap
            PopperComponent={StyledPopper}
            ListboxComponent={ListboxComponent}
            options={preparedList}
            noOptionsText={noOptionsText}
            classes={{ root: color === 'red' ? classes.autocomplete : classes.autocompleteWhite }}
            renderInput={(params) => <TextField {...params} placeholder={t('CustomerName')} />}
            renderOption={(props, option, state) =>
                [props, option, state.index] as React.ReactNode
            }
            onChange={(event, value) => {
                const selectedTradePoint = value ? customerMap.get(value) : null;

                if (selectedTradePoint) {
                    onSelect(selectedTradePoint);
                } else {
                    onSelect(null);
                }
            }}
            fullWidth
        />
    );
}

export default CustomerInfoSelect;
