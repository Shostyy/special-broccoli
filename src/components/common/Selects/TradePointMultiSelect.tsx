import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { TradePointData } from '../../../api/types/tradePointData';
import { useTranslation } from 'react-i18next';
import { useStyles } from './styles/useStyles';
import Chip from '@mui/material/Chip';
import Checkbox from '@mui/material/Checkbox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import Popper from '@mui/material/Popper';
import { ListChildComponentProps, VariableSizeList } from 'react-window';

interface TradePointMultiSelectProps {
    tradePointsList: TradePointData[];
    onSelect: (selectedTradePoint: TradePointData[] | null) => void;
    initialTradePoint?: TradePointData | null;
    selectedTradePointList?: TradePointData[];
    color?: 'red' | 'white';
    width?: string | number;
    height?: string | number;
    fontSize?: string | number;
}

const icon = <CheckBoxOutlineBlankIcon fontSize="small" sx={{color: '#c25458'}}/>;
const checkedIcon = <CheckBoxIcon fontSize="small" sx={{color: '#c25458'}}/>;

const LISTBOX_PADDING = 8; // px

function renderRow(props: ListChildComponentProps) {
    const { data, index, style } = props;
    const dataSet = data[index];
    const inlineStyle = {
        ...style,
        top: (style.top as number) + LISTBOX_PADDING,
    };

    if (!dataSet) {
        return null;
    }

    return React.cloneElement(dataSet, {
        style: inlineStyle,
    });
}

const OuterElementContext = React.createContext({});

const OuterElementType = React.forwardRef<HTMLDivElement>((props, ref) => {
    const outerProps = React.useContext(OuterElementContext);
    return <div ref={ref} {...props} {...outerProps} />;
});

const ListboxComponent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLElement>>(
    function ListboxComponent(props, ref) {
        const { children, ...other } = props;
        const itemData: React.ReactChild[] = [];
        (children as React.ReactChild[]).forEach((item: React.ReactChild & { children?: React.ReactChild[] }) => {
            itemData.push(item);
            itemData.push(...(item.children || []));
        });

        const itemCount = itemData.length;
        const itemSize = 48;

        const getChildSize = (child: React.ReactChild) => {
            if (child.hasOwnProperty('group')) {
                return 48;
            }
            return itemSize;
        };

        const getHeight = () => {
            if (itemCount > 8) {
                return 8 * itemSize;
            }
            return itemData.map(getChildSize).reduce((a, b) => a + b, 0);
        };

        const gridRef = React.useRef<VariableSizeList>(null);

        return (
            <div ref={ref}>
                <OuterElementContext.Provider value={other}>
                    <VariableSizeList
                        itemData={itemData}
                        height={getHeight() + 2 * LISTBOX_PADDING}
                        width="100%"
                        ref={gridRef}
                        outerElementType={OuterElementType}
                        innerElementType="ul"
                        itemSize={(index) => getChildSize(itemData[index])}
                        overscanCount={5}
                        itemCount={itemCount}
                    >
                        {renderRow}
                    </VariableSizeList>
                </OuterElementContext.Provider>
            </div>
        );
    },
);

const StyledPopper = (props: any) => {
    return <Popper {...props} placement="bottom-start" />;
};

const TradePointMultiSelect: React.FC<TradePointMultiSelectProps> = ({
    tradePointsList,
    onSelect,
    initialTradePoint,
    color = 'white',
    selectedTradePointList = [],
    width,
    height,
    fontSize,
}) => {
    const { t } = useTranslation();
    const classes = useStyles({ width, height, fontSize });
    const className = color === 'red' ? classes.autocomplete : classes.autocompleteWhite;

    return (
        <Autocomplete
            multiple
            id="trade-point-multi-select"
            options={tradePointsList}
            disableCloseOnSelect
            getOptionLabel={(option) => option.name}
            value={selectedTradePointList}
            onChange={(event, value) => onSelect(value)}
            renderOption={(props, option, { selected }) => (
                <li {...props}>
                    <Checkbox
                        icon={icon}
                        checkedIcon={checkedIcon}
                        style={{ marginRight: 8 }}
                        checked={selected}
                    />
                    {option.name}
                </li>
            )}
            renderInput={(params) => (
                <TextField
                    {...params}
                    placeholder={t('SelectTradePoints')}
                />
            )}
            renderTags={(value) => (
                <Chip label={`${value.length} ${t('Selected')}`} />
            )}
            className={className}
            sx={{
                bgcolor: '#fff',
                borderRadius: '5px',
            }}
            PopperComponent={StyledPopper}
            ListboxComponent={ListboxComponent}
        />
    );
};

export default TradePointMultiSelect;