import { GetStaticPaths, GetStaticProps } from 'next';
import styles from '../../styles/Product.module.css';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  description: string;
}

interface ProductDetailProps {
  product: Product;
}

export const getStaticPaths: GetStaticPaths = async () => {
  const res = await fetch('http://localhost:5000/products');
  const products: Product[] = await res.json();
  const paths = products.map((product) => ({
    params: { id: product.id.toString() },
  }));

  return { paths, fallback: 'blocking' };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const res = await fetch(`http://localhost:5000/products/${params?.id}`);
  const product: Product = await res.json();

  return {
    props: {
      product,
    },
    revalidate: 10, // Incremental Static Regeneration: regenerates the page every 10 seconds
  };
};

const ProductDetail: React.FC<ProductDetailProps> = ({ product }) => {
  return (
    <div className={styles.container}>
      <div className={styles.productDetail}>
        <h1>{product.name}</h1>
        <p>Price: ${product.price}</p>
        <p>Category: {product.category}</p>
        <p>{product.description}</p>
      </div>
    </div>
  );
};

export default ProductDetail;
