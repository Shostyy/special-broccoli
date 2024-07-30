import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { BranchOffice } from '../../../api/types/branchOffice'; // Assuming BranchOffice interface is defined
import { useTranslation } from 'react-i18next';
import { ListboxComponent, StyledPopper } from './components/CommonComponents'; // Assuming these are correctly imported
import { useStyles } from './styles/useStyles';

interface BranchOfficesSelectData {
    branchOfficeList: BranchOffice[];
    onSelect: (selectedBranchOffice: BranchOffice | null) => void;
    color?: 'red' | 'white';
    width?: string | number;
    height?: string | number;
    fontSize?: string | number;
}

const BranchOfficesSelect: React.FC<BranchOfficesSelectData> = ({
    branchOfficeList,
    onSelect,
    color = 'red',
    width,
    height,
    fontSize,
}) => {
    const { t } = useTranslation();

    // Memoize the mapping of customer names to BranchOffice objects
    const customerMap = React.useMemo(() => {
        const map = new Map<string, BranchOffice>();
        branchOfficeList.forEach(branchOffice => map.set(branchOffice.name, branchOffice));
        return map;
    }, [branchOfficeList]);

    // Prepare the list of customer names for Autocomplete options
    const preparedList = branchOfficeList.map(branchOffice => branchOffice.name);

    const classes = useStyles({ width, height, fontSize });

    // Determine the root class based on the color prop
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
            renderInput={(params) => <TextField {...params} placeholder={t('BranchOffices')} />}
            renderOption={(props, option, state) =>
                [props, option, state.index] as React.ReactNode
            }
            onChange={(event, value) => {
                const selectedBranchOffice = value ? customerMap.get(value) : null;

                if (selectedBranchOffice) {
                    onSelect(selectedBranchOffice);
                } else {
                    onSelect(null);
                }
            }}
            fullWidth
        />
    );
}

export default BranchOfficesSelect;
