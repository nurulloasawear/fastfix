// The primary "products" route renders My Products.
// Kept as a thin re-export so existing router wiring (@/pages/products/ProductsPage)
// keeps resolving; new code should import MyProductsPage directly.
export { MyProductsPage as ProductsPage } from './MyProductsPage'
