export const customTradePointFilter = (row: any, columnId: string, filterValue: string) => {
    const rowValue = row.getValue(columnId) as { name: string };
    return rowValue.name.toLowerCase().includes(filterValue.toLowerCase());
};

export default customTradePointFilter;