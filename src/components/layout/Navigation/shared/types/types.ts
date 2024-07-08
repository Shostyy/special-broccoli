export interface SubCategory {
    name: string;
    link: string;
    icon: string;
};

export interface Category {
    name: string;
    icon: string | null;
    subCategory: SubCategory[] | null;
};
