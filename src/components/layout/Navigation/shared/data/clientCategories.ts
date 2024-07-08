import { Category } from '../types/types';
import { categoriesIcons } from '../../../../../data/constants/icons';


export const clientCategories: Category[] = [
    {
        name: 'Calculations',
        icon: categoriesIcons.money,
        subCategory: [
            {
                name: 'Orders',
                link: 'orders',
                icon: categoriesIcons.money,
            },
            {
                name: 'Debts',
                link: 'debts',
                icon: categoriesIcons.money,
            },
        ],
    },
]