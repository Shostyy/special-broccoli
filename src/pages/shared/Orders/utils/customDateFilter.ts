import { MRT_RowData } from 'material-react-table';
import { parseISO } from 'date-fns';

type CustomDateFilterFn = (
    row: MRT_RowData,
    columnId: string,
    filterValue: [Date | null, Date | null]
) => boolean;

export const customDateFilter: CustomDateFilterFn = (row, columnId, filterValue) => {
    const rowValue = row.getValue(columnId) as string;
    const rowDate = parseISO(rowValue);

    let [start, end] = filterValue;

    const setEndOfDay = (date: Date | string | null): Date | null => {
        if (!date) return null;
        const endDate = new Date(date);
        endDate.setHours(23, 59, 59, 999);
        return endDate;
    };

    end = setEndOfDay(end);

    console.log(start, end);

    if (start && end) {
        return rowDate >= new Date(start) && rowDate <= end;
    } else if (start) {
        return rowDate >= new Date(start);
    } else if (end) {
        return rowDate <= end;
    }

    return true;
};

export default customDateFilter;
