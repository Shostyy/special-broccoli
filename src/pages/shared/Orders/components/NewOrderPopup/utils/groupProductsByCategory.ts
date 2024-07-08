import { PresentProduct } from '../../../../../../api/types/presentProduct';
import { ProductData } from '../../../../../../api/types/productData';

export const groupProductsByCategory = (currentProducts: PresentProduct[], products: ProductData[]) => {
    const grouped: { [category: string]: PresentProduct[] } = {};
    currentProducts.forEach(currentProduct => {
        const product = products.find(p => p.id === currentProduct.productId);
        if (product) {
            if (!grouped[product.categoryName]) {
                grouped[product.categoryName] = [];
            }
            grouped[product.categoryName].push(currentProduct);
        }
    });
    return grouped;
};