import { useState, useEffect } from "react";
import "./style.css";
import laptop from "./image/lapto.png";
import headphone from "./image/headphone.png";
import maygiat from "./image/maygiat.png";
import dongho from "./image/dongho.png";
import tv from "./image/tv.png";

const FlashSale = () => {
  const [countdown, setCountdown] = useState(3600);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}:${m}:${s}`;
  };

  const products = [
    { id: 1, name: "Smart TV 50 inch", oldPrice: 12000000, newPrice: 9500000, img: tv },
    { id: 2, name: "Laptop Dell XPS 13", oldPrice: 25000000, newPrice: 22000000, img: laptop },
    { id: 3, name: "Smartphone Galaxy S21", oldPrice: 18000000, newPrice: 15000000, img: dongho },
    { id: 4, name: "Tai nghe Sony WH-1000XM4", oldPrice: 8000000, newPrice: 7200000, img: headphone },
    { id: 5, name: "Máy giặt LG", oldPrice: 10000000, newPrice: 8500000, img: maygiat },
  ];

  return (
    <section className="flash-sale">
      <h2>Flash Sale 🔥</h2>
      <p>Thời gian còn lại: {formatTime(countdown)}</p>
      <div className="sale-products">
        {products.map(product => (
          <div key={product.id} className="product-card">
            <img className="image" src={product.img} alt={product.name} />
            <h3>{product.name}</h3>
            <p><del>{product.oldPrice.toLocaleString()}đ</del> <span>{product.newPrice.toLocaleString()}đ</span></p>
            <button className="buy-btn">Mua ngay</button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FlashSale;
