import { Category } from '../types/types';
import { categoriesIcons, subcategoriesIcons } from '../../../../../data/constants/icons';


export const clientCategories: Category[] = [
    {
        name: 'Calculations',
        icon: categoriesIcons.money,
        subCategory: [
            {
                name: 'Orders',
                link: 'orders',
                icon: subcategoriesIcons.shoppingBag,
            },
            {
                name: 'Debts',
                link: 'debts',
                icon: subcategoriesIcons.money,
            },
        ],
    },
    {
        name: 'Reports',
        icon: categoriesIcons.list,
        subCategory: [
            {
                name: 'CountersAndPrices',
                link: 'counters-drink-prices',
                icon: subcategoriesIcons.grocery,
            },
        ],
    },
]