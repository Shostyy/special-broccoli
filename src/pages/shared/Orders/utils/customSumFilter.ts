export const customSumFilter = (row: any, columnId: string, filterValue: [number | undefined, number | undefined]) => {
    const sum = row.getValue(columnId);
    const [min, max] = filterValue;

    if (min !== undefined && max !== undefined) {
        return sum >= min && sum <= max;
    } else if (min !== undefined) {
        return sum >= min;
    } else if (max !== undefined) {
        return sum <= max;
    }

    return true;
};

export default customSumFilter;