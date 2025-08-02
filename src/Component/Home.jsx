import React, { useState, useEffect } from 'react';
import './Home.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Link } from 'react-router-dom';
import Cart from './Cart';
import {
  FaHeart,
  FaSearch,
  FaUser,
  FaShoppingCart,
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaLinkedin,
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';


// Image imports
import IMG1 from '../assets/IMG-20250802-WA0001.jpg';
import IMG2 from '../assets/IMG-20250802-WA0002.jpg';
import IMG3 from '../assets/IMG-20250802-WA0003.jpg';
import IMG4 from '../assets/IMG-20250802-WA0004.jpg';
import IMG5 from '../assets/IMG-20250802-WA0005.jpg';
import IMG6 from '../assets/IMG-20250802-WA0006.jpg';
import IMG7 from '../assets/IMG-20250802-WA0007.jpg';
import IMG8 from '../assets/IMG-20250802-WA0008.jpg';
import IMG9 from '../assets/IMG-20250802-WA0009.jpg';
import IMG10 from '../assets/IMG-20250802-WA0010.jpg';
import IMG11 from '../assets/IMG-20250802-WA0011.jpg';
import IMG12 from '../assets/IMG-20250802-WA0012.jpg';
import LOGO_IMAGE from '../assets/LOGO.jpg';

import BOTTOM_IMG from '../assets/bottom.png';
import LoginRegister from './Login';



const categories = [
  { name: 'Fabric', img: 'https://m.media-amazon.com/images/I/71eErF68xxL._UF894%2C1000_QL80_.jpg' },
  { name: 'Leather', img: 'http://shop.gkwretail.com/cdn/shop/products/DesignerSofaSet-AMIA3_2FabricLuxuryFurnitureSofaSet_NavyBlue.jpg?v=1645601836' },
  { name: 'Velvet', img: 'http://www.getmycouch.com/cdn/shop/files/WhatsAppImage2022-12-04at8.56.38PM.jpg?v=1687424099' },
  { name: 'Sectional', img: 'https://www.urbanwood.in//image/cache/catalog/fabric-sofas/abro-new/3-seater/navy-blue/look-400x281.jpg' },
  { name: 'Recliner', img: 'https://www.getmycouch.com/cdn/shop/products/liana-3-2-sofa-set-in-premium-blue-fabric-sofa-fn-gmc-005617-18936294015142_d2015288-7def-46e5-a621-9cc9f152b01c.jpg?v=1705569914' },
];



const sofas = [
  { id: 1, name: 'Amber Three Seater Fabric Sofa', price: '₹48,999', oldPrice: '₹99,999', discount: 51, badge: 'New Arrival', img: IMG1, emi: '₹5801/Month' },
  { id: 2, name: 'Amber Two Seater Fabric Sofa', price: '₹40,000', oldPrice: '₹85,000', discount: 52, badge: 'New Arrival', img: IMG2, emi: '₹4736/Month' },
  { id: 3, name: 'Muar Malaysian Leatherette Sofa', price: '₹32,900', oldPrice: '₹69,999', discount: 52, badge: 'New Arrival', img: IMG3, emi: '₹3895/Month' },
  { id: 4, name: 'Classic Leather Sofa', price: '₹75,000', oldPrice: '₹1,25,000', discount: 40, badge: '', img: IMG4, emi: '₹8700/Month' },
  { id: 5, name: 'Tufted Velvet Loveseat', price: '₹52,000', oldPrice: '₹95,000', discount: 45, badge: '', img: IMG5, emi: '₹6000/Month' },
  { id: 6, name: 'Olive Green Sectional Sofa', price: '₹68,000', oldPrice: '₹1,15,000', discount: 41, badge: 'Limited Offer', img: IMG6, emi: '₹8000/Month' },
  { id: 7, name: 'Modern Chaise Lounge Sofa', price: '₹62,500', oldPrice: '₹1,20,000', discount: 48, badge: '', img: IMG7, emi: '₹7300/Month' },
  { id: 8, name: 'Mid‑Century Three‑Seater Sofa', price: '₹49,000', oldPrice: '₹89,000', discount: 45, badge: '', img: IMG8, emi: '₹5800/Month' },
  { id: 9, name: 'Slipcovered Coastal Sofa', price: '₹55,000', oldPrice: '₹1,00,000', discount: 45, badge: 'New Arrival', img: IMG9, emi: '₹6600/Month' },
  { id: 10, name: 'Curved Fabric Sofa', price: '₹58,000', oldPrice: '₹1,10,000', discount: 47, badge: '', img: IMG10, emi: '₹6900/Month' },
  { id: 11, name: 'Vintage Tufted Sofa', price: '₹59,000', oldPrice: '₹1,05,000', discount: 44, badge: '', img: IMG11, emi: '₹7000/Month' },
  { id: 12, name: 'Recliner Sectional Sofa', price: '₹85,000', oldPrice: '₹1,50,000', discount: 43, badge: 'Top Rated', img: IMG12, emi: '₹9900/Month' },
];


export default function Home() {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('');
    const [showLogin, setShowLogin] = useState(false); 

  useEffect(() => {
    AOS.init({ duration: 800 });
  }, []);

  const filteredSofas = sofas.filter((sofa) => {
    const matchesSearch = sofa.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === '' || sofa.name.toLowerCase().includes(activeCategory.toLowerCase());
    return matchesSearch && matchesCategory;
  });
const [user, setUser] = useState(null);

useEffect(() => {
  const savedUser = localStorage.getItem('loggedInUser');
  if (savedUser) {
    setUser(JSON.parse(savedUser));
  }
  AOS.init({ duration: 800 });
}, []);
const [cartItems, setCartItems] = useState([]);
const [pendingSofa, setPendingSofa] = useState(null);
const addToCart = (sofa) => {
  const alreadyInCart = cartItems.find(item => item.id === sofa.id);
  if (!alreadyInCart) {
    setCartItems(prev => [...prev, sofa]);
    navigate('/cart', { state: { cart: [...cartItems, sofa] } });
  }
};
useEffect(() => {
  if (user && pendingSofa) {
    addToCart(pendingSofa);
    setPendingSofa(null); // clear pending after adding
  }
}, [user, pendingSofa]);


  return (
    <>
    
    {showLogin && <LoginRegister onBack={() => setShowLogin(false)} />}
<nav className="bg-white shadow-sm py-3 fixed-top w-100" style={{ zIndex: 1030 }}>
  <div className="container d-flex flex-wrap justify-content-between align-items-center">
    {/* Logo */}
    <div className="d-flex align-items-center mb-2 mb-md-0">
      <img src={LOGO_IMAGE} alt="GOODWILL Logo" style={{ height: '60px', marginRight: '12px' }} />
      <span className="fw-bold fs-4 text-dark">GOODWILL LINING</span>
    </div>

    {/* Search */}
    <div className="d-flex align-items-center flex-grow-1 mx-4">
      <input
        type="text"
        className="form-control me-2"
        placeholder="Search sofas..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button className="btn btn-dark">
        <FaSearch />
      </button>
    </div>

    {/* Icons */}
    {user ? (
      <div className="text-dark d-flex flex-column align-items-center gap-5">
        <FaUser />
        <div className="small">{user.name}</div>
      </div>
    ) : (
      <div className="text-muted d-flex flex-column align-items-center"
        style={{ cursor: 'pointer' }}
        onClick={() => setShowLogin(true)}>
        <FaUser />
        <div className="small">Login</div>
      </div>
    )}

  <div
  className="text-muted d-flex flex-column align-items-center m-3"
  style={{ cursor: 'pointer' }}
  onClick={() => {
    if (!user) {
            navigate('/sofa/src/Component/Cart.jsx', { state: { cart: cartItems } }); 
 // Not logged in: show login modal
    } else {
            setShowLogin(true);
// Logged in: go to cart
    }
  }}
>
  <FaShoppingCart />
  <div className="small">Cart</div>
</div>

  </div>
</nav>  {/* ✅ ADD THIS if it's missing */}

      <main style={{ paddingTop: '100px' }} className="container-fluid p-0">
        <div className="bg-light py-5 px-5" style={{marginTop: '100px'}}>
          <section className="container text-center">
            <h2 className="mb-5 fw-bold text-uppercase">Sofa Categories</h2>
            <div className="row row-cols-2 row-cols-md-3 row-cols-lg-5 g-4 justify-content-center">
              {categories.map((cat, i) => (
                <div key={i} className="col">
                  <div
                    onClick={() => setActiveCategory(cat.name)}
                    className={`category-box bg-white p-4 text-center shadow-sm rounded h-100 ${
                      activeCategory === cat.name ? 'border border-primary' : ''
                    }`}
                    style={{ cursor: 'pointer' }}
                  >
                    <img
                      src={cat.img}
                      className="rounded-circle mb-3"
                      width="100"
                      height="100"
                      alt={cat.name}
                    />
                    <div className="fw-semibold small">{cat.name}</div>
                  </div>
                </div>
              ))}
            </div>
            {activeCategory && (
              <button className="btn btn-link mt-3" onClick={() => setActiveCategory('')}>
                Clear Filter
              </button>
            )}
          </section>
        </div>

        <div className="py-5">
          <section className="container">
            <h2 className="text-center mb-5 fw-bold text-uppercase">Our Sofa Collection</h2>
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
              {filteredSofas.length === 0 ? (
                <p className="text-center fs-5">
                  No sofas found matching "{searchTerm}" {activeCategory && `in category "${activeCategory}"`}
                </p>
              ) : (
                filteredSofas.map((sofa) => (
                  <div key={sofa.id} className="col" data-aos="fade-up">
                    <div className="card h-100 sofa-card border-0 rounded overflow-hidden">
                      <div className="position-relative">
                        {sofa.discount > 0 && (
                          <span className="badge bg-danger position-absolute top-0 start-0 m-2 fs-6">
                            {sofa.discount}% OFF
                          </span>
                        )}
                        <FaHeart className="position-absolute top-0 end-0 m-3 text-secondary fs-5" />
                        <img
                          src={sofa.img}
                          className="card-img-top"
                          alt={sofa.name}
                          style={{ height: '280px', objectFit: 'cover' }}
                        />
                      </div>
                      <div className="card-body d-flex flex-column">
                        {sofa.badge && <span className="badge bg-primary mb-2">{sofa.badge}</span>}
                        <h5 className="card-title fw-semibold">{sofa.name}</h5>
                        <p className="mb-1">
                          <span className="fw-bold">{sofa.price}</span>{' '}
                          <span className="text-muted text-decoration-line-through">
                            {sofa.oldPrice}
                          </span>
                        </p>
                        <p className="mb-3 small text-muted">{sofa.emi} EMI available</p>
<button
  className="btn btn-dark mt-auto"
  onClick={() => {
    if (!user) {
      setPendingSofa(sofa);    // 👈 save what they wanted to add
      setShowLogin(true);      // 👈 show login modal
    } else {
      addToCart(sofa);         // 👈 already logged in → add directly
    }
  }}
>
  Add to Cart
</button>


                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

         <section className="bg-light py-5 px-5 mb-4">
          <div className="container text-center">
            <h2 className="mb-4 fw-bold">About Our Store</h2>
            <p className="lead mb-4">
              At <strong>GOODWILL LINING</strong>, we specialize in manufacturing customized sofas, design chairs, headboards, cots, blinds, curtains, and mattresses tailored to your comfort and aesthetic.
            </p>
                        <h4 className="mt-4">Available Products</h4>
<img src={BOTTOM_IMG} alt="Goodwill Lining Store" className="img-fluid rounded mb-4" style={{ maxHeight: '400px', width:'400px'}} />


           
            <h4 className="mt-4">Store Location</h4>
            <p className="mb-3">Goodwill Lining, Perambur, Chennai</p>
            <iframe
              title="Goodwill Lining Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3890.556142385965!2d80.22096041482174!3d13.042161990800066!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5267e3b09e9f13%3A0x5c74f1fbbd20e70e!2sChennai%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1614165820000!5m2!1sen!2sin"
              width="100%"
              height="300"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div>
        </section>
      </main>

      <footer className="bg-dark text-white py-1 fixed-bottom w-100" style={{ zIndex: 1030 }}>
        <div className="container text-center small ">
         &copy; 2025 Goodwill Lining. All rights reserved.
       <FaFacebook />
            <FaInstagram />
            <FaYoutube />
        
        </div>
            </footer>
    </>

 
  );
}