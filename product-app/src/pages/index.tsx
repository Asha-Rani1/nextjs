import { useState } from 'react';
import Link from 'next/link';
import { GetStaticProps } from 'next';
import styles from '../styles/Product.module.css';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
}

interface ProductListProps {
  products: Product[];
}

export const getStaticProps: GetStaticProps = async () => {
  const res = await fetch('http://localhost:5000/products');
  const products: Product[] = await res.json();

  return {
    props: {
      products,
    },
    revalidate: 10, // Incremental Static Regeneration: regenerates the page every 10 seconds
  };
};

const ProductList: React.FC<ProductListProps> = ({ products }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const categories = products.map((product) => product.category)

  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter((product) => product.category === selectedCategory);

  return (
    <div className={styles.container}>
      <h1>Product List</h1>
      <div className={styles.filterButtons}>
        <button onClick={() => setSelectedCategory('All')}>All</button>
        {categories.map((category) => (
          <button key={category} onClick={() => setSelectedCategory(category)}>
            {category}
          </button>
        ))}
      </div>

      {filteredProducts.map((product) => (
        <div key={product.id} className={styles.productList}>
          <h2><Link href={`/product/${product.id}`}>{product.name}</Link></h2>
          <p>Price: ${product.price}</p>
          <p>Category: {product.category}</p>
        </div>
      ))}
    </div>
  );
};

export default ProductList;
