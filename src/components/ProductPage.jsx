import React from 'react';
import ProductShareCard from './ProductShareCard';
import './ProductPage.css';
const ProductPage = () => {
  const products = [
    {
      title: 'Wireless Headphones',
      imageUrl: '/wireless_headphones.png',
      price: 2999,
      discount: 15,
      rating: 4.5,
  description : 'High-quality wireless headphones with 40-hour battery life and noise cancellation.',
    tierDiscounts: [
      { quantity: 5, price: 2799 },
      { quantity: 10, price: 2599 }
    ],
    currentGroupJoined:3,
    groupExpiresAt : '2025-06-25T23:59:59Z'
    },
    {
      title: 'Water Bottle',
      imageUrl: 'water_bottle.jpg',
      price: 1499,
      discount: 10,
      rating: 4.0,
      description:'Aquaminder Water Bottle for Office Drink Reminder Smart Sipper Bottle for Adults & Kids for Gym Sports 770ml Frosted Tritan Glows.',
    tierDiscounts: [
      { quantity: 5, price: 1299 },
      { quantity: 10, price: 1149 }
    ],
  currentGroupJoined :4,
 groupExpiresAt : '2025-06-24T23:59:59Z'},
 
  ];

  return (
    <div className="product-list">
      {products.map((product, index) => (
        <ProductShareCard key={index} product={product} />
      ))}
    </div>
  );
};

export default ProductPage;
