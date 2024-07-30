import { MRT_RowData } from 'material-react-table';
import { parseISO } from 'date-fns';
import { END_OF_DAY } from '../../../../data/constants/constants';

export const customDateFilter = (
    row: MRT_RowData,
    columnId: string,
    filterValue: [Date | null, Date | null],
) => {
    const rowValue = row.getValue(columnId) as string;
    const rowDate = parseISO(rowValue);

    // eslint-disable-next-line
    let [start, end] = filterValue;

    const setEndOfDay = (date: Date | string | null): Date | null => {
        if (!date) return null;
        const endDate = new Date(date);
        endDate.setHours(...END_OF_DAY);
        return endDate;
    };

    end = setEndOfDay(end);

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
