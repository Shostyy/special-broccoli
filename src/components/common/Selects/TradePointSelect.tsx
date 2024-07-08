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
    color?: 'red' | 'white';
    width?: string | number;
    height?: string | number;
    fontSize?: string | number;
}

const TradePointSelect: React.FC<TradePointSelectData> = ({
    tradePointsList,
    onSelect,
    color = 'red',
    width,
    height,
    fontSize
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

    return (
        <Autocomplete
            disableListWrap
            PopperComponent={StyledPopper}
            classes={{ root: color === 'red' ? classes.autocomplete : classes.autocompleteWhite }}
            ListboxComponent={ListboxComponent}
            options={preparedList}
            noOptionsText={noOptionsText}
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
            onChange={(event, value) => {
                const selectedTradePoint = value ? tradePointMap.get(value) : null;

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

export default TradePointSelect;
