import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { useTranslation } from 'react-i18next';
import { ListboxComponent, StyledPopper } from './components/CommonComponents';
import { UserDialog } from '../../../api/types/userDialog';
import { useStyles } from './styles/useStyles';

interface UserSelectData {
    userList: UserDialog[];
    onSelect: (selectedTradePoint: UserDialog | null) => void;
    color?: 'red' | 'white';
    width?: string | number;
    height?: string | number;
    fontSize?: string | number;
}


const UserSelect: React.FC<UserSelectData> = ({
    userList,
    onSelect,
    color = 'red',
    width,
    height,
    fontSize
}) => {
    const { t } = useTranslation();

    const classes = useStyles({width, height, fontSize});

    const tradePointMap = React.useMemo(() => {
        const map = new Map<string, UserDialog>();
        userList.forEach(user => map.set(user.login, user));
        return map;
    }, [userList]);

    const preparedList = userList.map(user => user.login);

    const rootClass = color === 'red' ? classes.autocomplete : classes.autocompleteWhite;

    
    const noOptionsText = t('SearchNotFound');

    return (
        <Autocomplete
            disableListWrap
            PopperComponent={StyledPopper}
            ListboxComponent={ListboxComponent}
            options={preparedList}
            classes={{ root: rootClass }}
            noOptionsText={noOptionsText} 
            renderInput={(params) => <TextField {...params} placeholder={t('UserLogin')} />}
            renderOption={(props, option, state) =>
                [props, option, state.index] as React.ReactNode
            }
            //renderGroup={(params) => params as any}
            onChange={(event, value) => {
                const selectedTradePoint = value ? tradePointMap.get(value) : null;

                if (selectedTradePoint) {
                    onSelect(selectedTradePoint);
                }
            }}
            fullWidth
        />
    );
}

export default UserSelect;
