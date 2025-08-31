import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';
import { useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};



export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const {isAuthenticated} = useAuth();

  useEffect(()=>{
    console.log(isAuthenticated)
    if(!isAuthenticated){
      setCartItems([]);
    }
  },[])

  useEffect(()=>{
    const fetchCart = async () => {
      try{
        const response = await axios.get("http://localhost:3000/api/orders/cart/items", {
          headers: {
            "Content-Type": "application/json",
            Authorization:`Bearer ${localStorage.getItem("GYF_token")}` 
          }
        });
        // const cart = response.data.cartOrders;
        // console.log(cart)
        // setCartItems(cart?.items || []);
        // setTotal(cart?.totalAmount || 0);
        setCartItems(response.data[0].items || []);

        console.log("Fetched cart from server:", response.data);
      
  
      }catch(err){
        console.log(err)
      }
    }
  
    fetchCart();
  },[])

const addToCart = async (item, size, color, quantity = 1) => {
  console.log("Adding to cart:", item, size, color, quantity);
  // First, update local state
  setCartItems(prev => {
    const existingItem = prev.find(
      cartItem =>
        cartItem.id === item.id &&
        cartItem.selectedSize === size &&
        cartItem.selectedColor === color
    );

    if (existingItem) {
      return prev.map(cartItem =>
        cartItem.id === existingItem.id
          ? { ...cartItem, quantity: cartItem.quantity + quantity }
          : cartItem
      );
    }

    return [
      ...prev,
      {
        id: `${item.id}-${size}-${color}`,
        ...item,
        quantity,
        selectedSize: size,
        selectedColor: color
      }
    ];
  });

  // Then, send POST request to backend
  try {
    const response = await axios.post(
      "http://localhost:3000/api/orders/cart/add",
      {
        item: {
          ...item,
          quantity,
          selectedSize: size,
          selectedColor: color
        }
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization:`Bearer ${localStorage.getItem("GYF_token")}` 
          // optionally add auth token if required
        }
      }
    );
    console.log("Cart updated on server:", response.data);
  } catch (error) {
    console.error("Error adding item to cart:", error.response?.data || error.message);
  }
};


  const removeFromCart = async (itemId) => {
    console.log(itemId)
    setCartItems(prev => prev.filter(item => item.id !== itemId));
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/orders/cart/${JSON.parse(localStorage.getItem("GYF_user"))._id}/item/${itemId}`,
        {
          headers: {
            Authorization:`Bearer ${localStorage.getItem("GYF_token")}`
          }
        }
      );
      console.log("Cart updated on server:", response.data);
    } catch (error) {
      console.error("Error adding item to cart:", error.response?.data || error.message);
    }
  };

  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    
    setCartItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = async() => {
    setCartItems([]);
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/orders/cart/clear/${JSON.parse(localStorage.getItem("GYF_user"))._id}`,
        {
          headers: {
            contentType: "application/json",
            Authorization:`Bearer ${localStorage.getItem("GYF_token")}` 
          }
        }
      );
      console.log("Cart cleared on server:", response.data);
      
    } catch (error) {
      console.error("Error clearing cart:", error.response?.data || error.message);
    }
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };
  const handleCheckout = async () => {
    try {
      const response = await axios.post(
        `http://localhost:3000/api/orders/cart/checkout/${JSON.parse(localStorage.getItem("GYF_user"))._id}`,
        {orderStatus: "delivered"},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization:`Bearer ${localStorage.getItem("GYF_token")}` 
          }
        }
      );
      console.log("Checkout successful:", response.data);
      setCartItems([]);
      // Optionally clear cart or redirect user
      clearCart();
    } catch (error) {
      console.error("Error during checkout:", error.response?.data || error.message);
    }

  }

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getTotalItems,
      getTotalPrice,
      handleCheckout
    }}>
      {children}
    </CartContext.Provider>
  );
};