export const customStatusFilter = (row: any, columnId: string, filterValue: string[]) => {
    const rowValue = row.getValue(columnId) as string;
    return filterValue.includes(rowValue);
};

export default customStatusFilter;