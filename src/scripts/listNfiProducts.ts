import { products } from '../data/products';

const nfiProducts = products.filter(p => p.categorySlug === 'nfi-items');

console.log(JSON.stringify(nfiProducts.map(p => ({
    name: p.name,
    description: p.description
})), null, 2));
