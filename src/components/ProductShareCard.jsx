import React, { useState,useEffect } from 'react';
import {
  FacebookIcon,
  WhatsappIcon,
  TwitterIcon,
} from 'react-share';

import { FaLink, FaInstagram,FaEnvelope } from 'react-icons/fa';
import { MdShare } from 'react-icons/md';
import './ProductShareCard.css'; // Import CSS
import { FaStar, FaRegStar, FaStarHalfAlt } from 'react-icons/fa';
import { Helmet } from 'react-helmet-async';
const ProductShareCard = ({ product }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [copyLinkMessage, setCopyLinkMessage] = useState('');
  const [backendResponse, setBackendResponse] = useState({
    facebook: '',
    whatsapp: '',
    twitter: '',
  });

  const { title, imageUrl, price, discount, description, tierDiscounts = [], currentGroupJoined,groupExpiresAt } = product;
const [timeLeft, setTimeLeft] = useState('');
const productLink = 'https://bazello.com/product/123';
const groupBuyText = tierDiscounts.length
  ? `🎯 Group-buy price: ₹${tierDiscounts[0].price} (min ${tierDiscounts[0].quantity}+ people)`
  : '';

const shareMessage = `🔥 Check out this amazing deal on Bazello!
${title} – ₹${price}
${groupBuyText}
🛒 Buy now: ${productLink}
#Bazello #GroupBuyDeals`;

const backendUrls = {
  facebook: 'http://localhost:8080/api/share/facebook',
  whatsapp: 'http://localhost:8080/api/share/whatsapp',
  twitter: 'http://localhost:8080/api/share/twitter',
};


useEffect(() => {
  const interval = setInterval(() => {
    const now = new Date();
    const end = new Date(groupExpiresAt);
    const diff = end - now;

    if (diff <= 0) {
      setTimeLeft('Expired');
      clearInterval(interval);
      return;
    }

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
  }, 1000);

  return () => clearInterval(interval);
}, [groupExpiresAt]);

const sharePayload = {
  title,
  imageUrl,
  price,
  discount,
  productLink,
  shareMessage,
  description,
  tierDiscounts,
  currentGroupJoined,
  groupExpiresAt,
};

  const handleBackendShare = async (platform) => {
  try {
 // Ask backend to generate platform share URL
    const response = await fetch(`http://localhost:8080/api/share/${platform}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sharePayload),
    });

    const shareUrl = await response.text();

    //Open the public share URL in new tab
    window.open(shareUrl, '_blank');

    // Optionally set the response message
    setBackendResponse((prev) => ({ ...prev, [platform]: 'Opening share dialog...' }));
  } catch (error) {
    alert(`Error sharing on ${platform}: ${error.message}`);
  }
};
const handleCopyLink = async () => {
  try {
    await navigator.clipboard.writeText(productLink);
    setCopyLinkMessage('Link copied to clipboard!');
  } catch {
    alert('Failed to copy the link.');
  }
};

  const renderShareOption = (icon, label, onClick, responseText = '') => (
    <li>
      <button onClick={onClick} className="share-option">
        {icon}
        <span>{label}</span>
      </button>
      {responseText && <p className="share-response">{responseText}</p>}
    </li>
  );
const renderStars = (rating) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  const stars = [];

  for (let i = 0; i < fullStars; i++) {
    stars.push(<FaStar key={`full-${i}`} className="star-icon" />);
  }

  if (halfStar) {
    stars.push(<FaStarHalfAlt key="half" className="star-icon" />);
  }

  for (let i = 0; i < emptyStars; i++) {
    stars.push(<FaRegStar key={`empty-${i}`} className="star-icon" />);
  }

  return stars;
};
<Helmet>
  <title>{`${title} - ₹${price} | Bazello`}</title>
  <meta property="og:title" content={`${title} - ₹${price}`} />
  <meta property="og:description" content={description} />
  <meta property="og:image" content={imageUrl} />
  <meta property="og:url" content={productLink} />
  <meta property="og:type" content="product" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={`${title} - ₹${price}`} />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:image" content={imageUrl} />
</Helmet>
  return (
    <div className="product-card">
      <div>
        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          className="share-button"
        >
          <MdShare />
          Share
        </button>

        {menuOpen && (
          <ul className="share-menu">
            {renderShareOption(<FacebookIcon size={24} round />, '', () => handleBackendShare('facebook'), backendResponse.facebook)}
            {renderShareOption(<WhatsappIcon size={24} round />, '', () => handleBackendShare('whatsapp'), backendResponse.whatsapp)}
            {renderShareOption(<TwitterIcon size={24} round />, '', () => handleBackendShare('twitter'), backendResponse.twitter)}
            {renderShareOption(<FaLink size={20} />, '', handleCopyLink)}
            {copyLinkMessage && <p className="copy-message">{copyLinkMessage}</p>}
            {renderShareOption(<FaEnvelope size={24} round />,'',()=>handleBackendShare('email'),backendResponse.email)}
            {renderShareOption(<FaInstagram size={20} />, '', () => alert('Instagram sharing must be done manually.'))}
          </ul>
        )}
      </div>

      <img
        src={imageUrl}
        alt={title}
        className="product-image"
      />
      <div className="product-rating">
  {renderStars(product.rating || 4.0)} <span className="rating-value">{product.rating}</span>
   </div>
      <h2 className="product-title">{title}</h2>
      <p className="product-price">Price: ₹{price}</p>
      <p className="product-discount"> Discount: Up to {discount}% off</p>
      <p className="product-description">{description}</p>
      {tierDiscounts.length > 0 && (
  <div className="group-buy">
    <h4>Group Buy Offers</h4>
    <ul>
      {tierDiscounts.map((tier, index) => (
        <li key={index}>
          ₹{tier.price} each if {tier.quantity}+ people join
        </li>
      ))}
    </ul>
    <p>  🎉 {currentGroupJoined} people have already joined! Join now and get it for ₹{tierDiscounts[0].price}! </p>
     <p className="group-timer">
      ⏳ Time left to join: <strong>{timeLeft}</strong>
    </p>
  </div>
)}

    </div>
  );
};

export default ProductShareCard;
