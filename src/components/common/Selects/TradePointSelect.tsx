import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { TradePointData } from '../../../api/types/tradePointData';
import { useTranslation } from 'react-i18next';
import { ListboxComponent, StyledPopper } from './components/CommonComponents';
import { useStyles } from './styles/useStyles';

interface TradePointSelectData {
    tradePointsList: TradePointData[];
    onSelect: (selectedTradePoint: TradePointData | null) => void;
    initialTradePoint?: TradePointData | null;
    color?: 'red' | 'white';
    width?: string | number;
    height?: string | number;
    fontSize?: string | number;
}

const TradePointSelect: React.FC<TradePointSelectData> = ({
    tradePointsList,
    onSelect,
    initialTradePoint,
    color = 'red',
    width,
    height,
    fontSize,
}) => {
    const { t } = useTranslation();

    const tradePointMap = React.useMemo(() => {
        const map = new Map<string, TradePointData>();
        tradePointsList.forEach(tp => map.set(tp.name, tp));
        return map;
    }, [tradePointsList]);

    const preparedList = tradePointsList.map(tp => tp.name);

    const classes = useStyles({ width, height, fontSize });

    const noOptionsText = t('SearchNotFound');

    const [value, setValue] = React.useState<string | null>(initialTradePoint ? initialTradePoint.name : null);

    React.useEffect(() => {
        setValue(initialTradePoint ? initialTradePoint.name : null);
    }, [initialTradePoint]);

    return (
        <Autocomplete
            disableListWrap
            PopperComponent={StyledPopper}
            classes={{ root: color === 'red' ? classes.autocomplete : classes.autocompleteWhite }}
            ListboxComponent={ListboxComponent}
            options={preparedList}
            noOptionsText={noOptionsText}
            value={value}
            renderInput={(params) => (
                <TextField
                    {...params}
                    placeholder={t('ChooseTradePoint')}
                    fullWidth
                    InputProps={{ ...params.InputProps, style: { fontSize: fontSize, height: height } }}
                />
            )}
            renderOption={(props, option, state) =>
                [props, option, state.index] as React.ReactNode
            }
            onChange={(event, newValue) => {
                const selectedTradePoint = newValue ? tradePointMap.get(newValue) : null;
                setValue(newValue);

                if (selectedTradePoint) {
                    onSelect(selectedTradePoint);
                }
            }}
            fullWidth
        />
    );
}

export default TradePointSelect;
