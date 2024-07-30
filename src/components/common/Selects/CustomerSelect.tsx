import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { CustomerData } from '../../../api/types/customerData';
import { useTranslation } from 'react-i18next';
import { ListboxComponent, StyledPopper } from './components/CommonComponents';
import { useStyles } from './styles/useStyles';

interface CustomerSelectData {
    customersList: CustomerData[];
    onSelect: (selectedTradePoint: CustomerData | null) => void;
    color?: 'red' | 'white';
    width?: string | number;
    height?: string | number;
    fontSize?: string | number;
}


const CustomerSelect: React.FC<CustomerSelectData> = ({
    customersList,
    onSelect,
    color = 'red',
    width,
    height,
    fontSize,
}) => {
    const { t } = useTranslation();

    const customerMap = React.useMemo(() => {
        const map = new Map<string, CustomerData>();
        customersList.forEach(customer => map.set(customer.name, customer));
        return map;
    }, [customersList]);

    const preparedList = customersList.map(customer => customer.name);

    const classes = useStyles({ width, height, fontSize });
    
    const noOptionsText = t('SearchNotFound');

    return (
        <Autocomplete
            disableListWrap
            PopperComponent={StyledPopper}
            ListboxComponent={ListboxComponent}
            options={preparedList}
            classes={{ root: color === 'red' ? classes.autocomplete : classes.autocompleteWhite }}
            noOptionsText={noOptionsText} 
            renderInput={(params) => <TextField {...params} placeholder={t('CustomerName')} />}
            renderOption={(props, option, state) =>
                [props, option, state.index] as React.ReactNode
            }
            //renderGroup={(params) => params as any}
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

export default CustomerSelect;
