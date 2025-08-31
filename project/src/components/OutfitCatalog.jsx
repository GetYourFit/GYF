import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, ShoppingBag, Star, X, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

// Mocking hooks for standalone environment if needed
// const useCart = () => ({
//   addToCart: (item, size, color) => console.log('Added to cart:', { item, size, color }),
// });
// const useNavigate = () => (path) => console.log(`Navigating to ${path}`);
// const useAuth = () => ({
//   token: 'your-placeholder-auth-token',
//   user: { _id: '123', name: 'Test User' },
//   recommendations: [{
//     "recommendations": [
//       { "confidence_score": 0.716, "image_url": "https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/20588656/2022/11/2/3de5915e-a691-4e48-9fc0-f89496e0def91667391482222Suits1.jpg", "items": [{ "name": "Wintage Suit" }], "product_url": "https://www.myntra.com/suits/wintage/wintage-men-blue-solid-single-breasted--3-piece-suit/20588656/buy", "set_id": "images/product145.jpg", "title": "Wintage - Men Single-Breasted Suits" },
//       { "confidence_score": 0.686, "image_url": "https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/23043878/2023/5/5/2c59b993-d71a-4715-87cb-4d1e0420159c1683292889687ArrowZeroCalorieSlimFitKnitSuit1.jpg", "items": [{ "name": "Arrow Knit Suit" }], "product_url": "https://www.myntra.com/suits/arrow/arrow-slim-fit-single-breasted-2-piece-formal-suit/23043878/buy", "set_id": "images/product114.jpg", "title": "Arrow - 2 Piece Single-Breasted Suit" }
//     ]
//   }]
// });

const OutfitCatalog = ({ onBack }) => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState(new Set());
  const [selectedOutfit, setSelectedOutfit] = useState(null);
  const {token, user, recommendations} = useAuth();
  const [count, setCount] = useState(null); // This will hold the map of purchased item counts
  const { addToCart } = useCart();


  const outfits = useMemo(() => {
    if (!recommendations || !recommendations[0] || !recommendations[0].recommendations) {
      return [];
    }
    
    return recommendations[0].recommendations.map(rec => {
      const mockItems = (rec.items || []).map((item, idx) => ({
          id: item.id || `${rec.set_id}-${idx}`,
          name: item.name || `Item ${idx + 1}`,
          imageUrl: item.imageUrl || item.image || rec.image_url || "",
          price: item.price || (Math.floor(Math.random() * 4000) + 1000),
          quantity: item.quantity || 1,
          selectedSize: (item.sizes && item.sizes[0]) || "S",
          selectedColor: (item.colors && item.colors[0]) || "black",
          sizes: item.sizes || ["XS", "S", "M", "L", "XL"],
          colors: item.colors || ["white", "black", "blue"],
      }));
    
      const totalPrice = mockItems.reduce((acc, item) => acc + item.price, 0);

      return {
        id: rec.set_id || Math.random().toString(),
        name: rec.title,
        imageUrl: rec.image_url,
        productUrl: rec.product_url,
        matchScore: Math.round(rec.confidence_score * 100),
        items: mockItems,
        totalPrice: totalPrice,
      };
    });
  }, [recommendations]);

  useEffect(()=>{
    const fetchCounts = async () => {
      if (!user || !user._id) return;
      try{
        const response = await fetch(`http://localhost:3000/api/orders/cart/recent/${user._id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization:`Bearer ${localStorage.getItem("GYF_token") || token}` 
          }
        });
        if (!response.ok) {
            throw new Error('Failed to fetch purchase counts');
        }
        const data = await response.json();
        setCount(data); // Assuming data is the map { "item name": count }
      }catch(err){
        console.error("Error fetching purchase counts:", err);
        // Set an empty object on error to prevent breaking the logic
        setCount({}); 
      }
    }
    fetchCounts();
  },[user, token]);

  const toggleFavorite = (outfitId) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(outfitId)) {
        newFavorites.delete(outfitId);
      } else {
        newFavorites.add(outfitId);
      }
      return newFavorites;
    });
  };

  const handleAddToCart = (outfit) => {
    outfit.items.forEach((item) => {
      if (item) {
        const size = Array.isArray(item.sizes) && item.sizes.length > 0 
          ? item.sizes[0] 
          : "Default";
        const color = Array.isArray(item.colors) && item.colors.length > 0 
          ? item.colors[0] 
          : "Default";
        addToCart(item, size, color, 1);
      }
    });
  };
  
  const handleBackToHome = () => {
    if (onBack) onBack();
    navigate('/');
  };

  const averageMatchScore = outfits.length > 0
    ? Math.round(outfits.reduce((acc, outfit) => acc + outfit.matchScore, 0) / outfits.length)
    : 0;

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative z-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <motion.header 
        className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl shadow-sm border-b border-gray-100"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <motion.button
                onClick={handleBackToHome}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors group"
                whileHover={{ x: -3 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="p-2 rounded-xl bg-gray-100 group-hover:bg-gray-200 transition-colors">
                  <ArrowLeft className="h-5 w-5" />
                </div>
              </motion.button>
              
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Your Style Recommendations
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  Curated for you based on your photo and preferences.
                </p>
              </div>
            </div>
            
            <motion.div 
              className="hidden sm:block bg-gradient-to-r from-green-100 to-emerald-100 px-5 py-2 rounded-2xl border border-green-200"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
            >
              <div className="text-green-700 text-xs font-medium">Average Match</div>
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-green-600" />
                <span className="text-green-800 font-bold text-lg">
                  {averageMatchScore}%
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
        >
          {outfits.map((outfit) => {
            // ** NEW LOGIC **
            // Check if any item in the outfit is new to the user.
            // This check is safe even if `count` is null initially.
            const isNewForUser = count && outfit.items.some(item => !count.hasOwnProperty(item.name));
            
            return (
            <motion.div
              key={outfit.id}
              className="group bg-white/90 backdrop-blur-sm rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer border border-white/50"
              layoutId={`card-${outfit.id}`}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              whileHover={{ y: -8, scale: 1.02 }}
              onClick={() => setSelectedOutfit(outfit)}
            >
              <div className="relative aspect-[3/4] overflow-hidden">
                <img
                  src={outfit.imageUrl}
                  alt={outfit.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <motion.button
                  onClick={(e) => { e.stopPropagation(); toggleFavorite(outfit.id); }}
                  className="absolute top-4 right-4 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-md"
                  whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                >
                  <Heart className={`h-5 w-5 transition-all ${favorites.has(outfit.id) ? 'text-red-500 fill-current' : 'text-gray-500'}`} />
                </motion.button>
                <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                  <Star className="h-4 w-4 fill-current" />
                  <span>{outfit.matchScore}%</span>
                </div>

                {/* ** NEWLY ADDED DIV ** */}
                {isNewForUser && (
                  <div className="absolute bottom-4 left-4 bg-indigo-600 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1.5">
                    <span>✨</span>
                    <span>Explore New Style</span>
                  </div>
                )}
              </div>

              <div className="p-5 space-y-3">
                <h3 className="text-lg font-bold text-gray-900 truncate group-hover:text-indigo-600">{outfit.name}</h3>
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <div>
                    <div className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      ₹{outfit.totalPrice.toLocaleString('en-IN')}
                    </div>
                    <div className="text-xs text-gray-500">Estimated Price</div>
                  </div>
                  <motion.button 
                    className="bg-indigo-600 text-white px-5 py-2 rounded-xl flex items-center space-x-2 font-semibold"
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  >
                    <ShoppingBag className="h-4 w-4" />
                    <span>Details</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
            );
          })}
        </motion.div>
      </main>

      {/* Outfit Detail Modal */}
      <AnimatePresence>
        {selectedOutfit && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOutfit(null)}
            />
            <motion.div
              layoutId={`card-${selectedOutfit.id}`}
              className="relative w-full max-w-3xl bg-white rounded-2xl overflow-hidden shadow-2xl"
            >
              <div className="grid md:grid-cols-2">
                <div className="relative aspect-[3/4] md:aspect-auto">
                   <img src={selectedOutfit.imageUrl} alt={selectedOutfit.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-6 flex flex-col">
                  <h2 className="text-2xl font-bold text-gray-900">{selectedOutfit.name}</h2>
                  <div className="text-sm text-gray-500 mb-4">Style Match: {selectedOutfit.matchScore}%</div>
                  
                  <div className="flex-grow space-y-2 overflow-y-auto max-h-48 pr-2">
                    <h3 className="font-semibold text-gray-700">Detected Items:</h3>
                    {selectedOutfit.items.map((item, idx) => (
                      <div
                        key={item.id || idx}
                        className="flex justify-between items-center text-sm p-2 bg-gray-50 rounded-lg"
                      >
                        <span className="text-gray-800">{item.name}</span>
                        <span className="text-gray-600">~ ₹{item.price.toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <div className="text-xs text-gray-500">Total Estimated Price</div>
                        <div className="text-3xl font-bold text-indigo-600">₹{selectedOutfit.totalPrice.toLocaleString('en-IN')}</div>
                      </div>
                      <a href={selectedOutfit.productUrl} target="_blank" rel="noopener noreferrer" className="bg-green-500 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-green-600 transition-colors">
                        <ExternalLink className="h-4 w-4" />
                        <span>View Store</span>
                      </a>
                    </div>
                     <motion.button 
                      onClick={() => handleAddToCart(selectedOutfit)}
                      className="w-full bg-indigo-600 text-white py-3 rounded-xl flex items-center justify-center space-x-2 font-semibold"
                      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    >
                      <ShoppingBag className="h-5 w-5" />
                      <span>Add All to Cart</span>
                    </motion.button>
                  </div>
                </div>
              </div>
              <motion.button
                onClick={() => setSelectedOutfit(null)}
                className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-sm rounded-full"
                whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
              >
                <X className="h-5 w-5 text-gray-700" />
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default OutfitCatalog;

