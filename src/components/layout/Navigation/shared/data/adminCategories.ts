import { Category } from '../types/types';
import { categoriesIcons, subcategoriesIcons } from '../../../../../data/constants/icons'

export const adminCategories: Category[] = [
    {
        name: 'UserInfo',
        icon: categoriesIcons.users,
        subCategory: [
            {
                name: 'Users',
                link: 'users',
                icon: subcategoriesIcons.group,
            },
            {
                name: 'UserRegistration',
                link: 'register',
                icon: subcategoriesIcons.groupAdd,
            },
            {
                name: 'Roles',
                link: 'roles',
                icon: subcategoriesIcons.groupSettings,
            },
        ],
    },
    {
        name: 'References',
        icon: categoriesIcons.directory,
        subCategory: [
            {
                name: 'BranchOffices',
                link: 'branch-offices',
                icon: subcategoriesIcons.office,
            },
            {
                name: 'Customers',
                link: 'customers',
                icon: subcategoriesIcons.person,
            },
            {
                name: 'TradePoints',
                link: 'trade-points',
                icon: subcategoriesIcons.tradePoint,
            },
            {
                name: 'Categories',
                link: 'categories',
                icon: subcategoriesIcons.categories,
            },
            {
                name: 'Products',
                link: 'products',
                icon: subcategoriesIcons.coffee,
            },
            {
                name: 'ProductPrices',
                link: 'product-prices',
                icon: subcategoriesIcons.money,
            },
            {
                name: 'ProductRemains',
                link: 'product-remains',
                icon: subcategoriesIcons.storage,
            },
            {
                name: 'Materials',
                link: 'materials',
                icon: subcategoriesIcons.materials,
            },
            {
                name: 'Models',
                link: 'models',
                icon: subcategoriesIcons.models,
            },
            {
                name: 'CommercialEquipment',
                link: 'commercial-equipment',
                icon: subcategoriesIcons.coffeeMaker,
            },
        ],
    },
    {
        name: 'Calculations',
        icon: categoriesIcons.money,
        subCategory: [
            {
                name: 'Order',
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
                name: 'ProducedReport',
                link: 'produced-report',
                icon: subcategoriesIcons.controls,
            },
            {
                name: 'CommercialEquipmentCtrl',
                link: 'commercial-equipment-controls',
                icon: subcategoriesIcons.counter,
            },
            {
                name: 'ActualCountAndCalc',
                link: 'counters-drink-prices',
                icon: subcategoriesIcons.grocery,
            },
        ]
    },
    {
        name: 'Settings',
        icon: categoriesIcons.settings,
        subCategory: [
            {
                name: 'PostServer',
                link: 'postserver',
                icon: subcategoriesIcons.mailbox,
            },
        ],
    }
];
