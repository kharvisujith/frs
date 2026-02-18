import { products } from '../data/products';

const grouped = products.reduce((acc, product) => {
    const slug = product.categorySlug || 'uncategorized';
    if (!acc[slug]) {
        acc[slug] = [];
    }
    acc[slug].push({
        name: product.name,
        description: product.description
    });
    return acc;
}, {} as Record<string, { name: string, description: string }[]>);

console.log(JSON.stringify(grouped, null, 2));
