import { subcategoriesIcons } from './icons';

interface TitleTranslationDictionary {
    [key: string]: string;
}

interface TitleImageDictionary {
    [key: string]: string;
}

export const titleTranslationDictionary: TitleTranslationDictionary = {
    '': 'ClientOffice',
    'users': 'Users',
    'register': 'UserRegistration',
    'roles': 'Roles',
    'branch-offices': 'BranchOffices',
    'customers': 'Customers',
    'trade-points': 'TradePoints',
    'categories': 'Categories',
    'products': 'Products',
    'product-prices': 'ProductPrices',
    'product-remains': 'ProductRemains',
    'orders': 'Order',
    'debts': 'Debts',
    'postserver': 'PostServer',
    'account': 'Account',
    'complete-registration': 'PasswordUpdate',
    'reset-password': 'ResetPassword',
    'materials': 'Materials',
    'models': 'Models',
    'commercial-equipment': 'CommercialEquipment',
    'produced-report': 'ProducedReport',
    'commercial-equipment-controls': 'CommercialEquipmentCtrl',
    'counters-drink-prices': 'CountersAndPrices',
};

export const titleImageDictionary: TitleImageDictionary = {
    '': 'ClientOffice',
    'users': subcategoriesIcons.group,
    'register': subcategoriesIcons.groupAdd,
    'roles': subcategoriesIcons.groupSettings,
    'branch-offices': subcategoriesIcons.office,
    'customers': subcategoriesIcons.person,
    'trade-points': subcategoriesIcons.tradePoint,
    'categories': subcategoriesIcons.categories,
    'products': subcategoriesIcons.coffee,
    'product-prices': subcategoriesIcons.money,
    'product-remains': subcategoriesIcons.storage,
    'orders': subcategoriesIcons.shoppingBag,
    'debts': subcategoriesIcons.money,
    'postserver': subcategoriesIcons.mailbox,
    'account': subcategoriesIcons.pen,
    'materials': subcategoriesIcons.materials,
    'models': subcategoriesIcons.models,
    'commercial-equipment': subcategoriesIcons.coffeeMaker,
    'produced-report': subcategoriesIcons.controls,
    'commercial-equipment-controls': subcategoriesIcons.counter,
    'counters-drink-prices': subcategoriesIcons.grocery,
};