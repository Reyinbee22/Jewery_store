import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import { Dialog, DialogTitle, DialogPanel, DialogBackdrop } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { jwtDecode } from "jwt-decode";

const CartItem = ({ item, onRemove }) => {
  return (
    <div className="flex py-4 border-b border-gray-200">
      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg border border-gray-200">
        <img
          alt={item.productId.name}
          src={item.productId.image || ""}
          className="h-full w-full object-cover object-center"
        />
      </div>
      <div className="ml-4 flex flex-1 flex-col">
        <div className="flex justify-between text-lg font-semibold text-gray-900">
          <span>{item.productId.name}</span>
          <span className="ml-4">₦{item.productId.price * item.quantity}</span>
        </div>
        <div className="flex mt-2">
          <button
            type="button"
            className="text-sm text-gray-500 hover:text-gray-700"
            onClick={() => onRemove(item.productId._id, false)}
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [open, setOpen] = useState(true);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const apiBaseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
  const userId = jwtDecode(token).userId;

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/cart`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCart(response.data.products);
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    };

    fetchCart();
  }, [token, apiBaseUrl]);

  const handleCheckout = () => {
    navigate("/checkout");
  };

  const handleContinueShopping = () => {
    navigate("/products");
  };

  const removeItem = async (productId, completeRemoval) => {
    try {
      if (completeRemoval) {
        await axios.delete(`${apiBaseUrl}/cart/${productId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: { quantity: 1 }
        });

        setCart((prevCart) => prevCart.filter((item) => item.productId._id !== productId));
      } else {
        await axios.delete(`${apiBaseUrl}/cart/${productId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: { quantity: 1 }
        });

        setCart((prevCart) => prevCart.map((item) => item.productId._id === productId
          ? { ...item, quantity: item.quantity - 1 }
          : item).filter((item) => item.quantity > 0));
      }
    } catch (error) {
      console.error("Error updating item quantity:", error);
    }
  };

  const clearCart = async () => {
    try {
      const response = await axios.delete(`${apiBaseUrl}/cart/clear/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setCart([]);
        toast.success('Cart cleared successfully');
      } else {
        throw new Error('Failed to clear the cart');
      }
    } catch (error) {
      console.error('Error clearing the cart:', error);
      toast.error('Failed to clear the cart');
    }
  };

  const subtotal = cart.reduce((total, item) => total + item.productId.price * item.quantity, 0).toFixed(2);

  return (
    <Dialog open={open} onClose={() => setOpen(false)} className="fixed inset-0 z-10">
      <DialogBackdrop className="fixed inset-0 bg-gray-800 bg-opacity-75 transition-opacity" />
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-0 flex max-w-full">
            <DialogPanel className="pointer-events-auto w-full max-w-4xl mx-auto">
              <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                <div className="flex-1 overflow-y-auto p-6">
                  <div className="flex items-center justify-between">
                    <DialogTitle className="text-2xl font-bold text-gray-900">Shopping Cart</DialogTitle>
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      className="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
                    >
                      <span className="sr-only">Close panel</span>
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                  <div className="mt-8 ">
                    {cart.length === 0 ? (
                      <p className="text-center text-gray-500">Your cart is empty.</p>
                    ) : (
                      <div className="flow-root">
                        <ul role="list" className="-my-4 divide-y divide-gray-200">
                          {cart.map((item) => (
                            <CartItem key={item.productId._id} item={item} onRemove={removeItem} />
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                <div className="border-t border-gray-200 p-6">
                  <div className="flex justify-between text-xl font-bold text-gray-900">
                    <span>Subtotal</span>
                    <span>₦{subtotal}</span>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
                  <div className="mt-6">
                    <button
                      type="button"
                      className="w-full flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 text-lg font-medium text-white shadow-sm hover:bg-blue-700"
                      onClick={handleCheckout}
                    >
                      Checkout
                    </button>
                  </div>
                  <div className="mt-4">
                    <button
                      type="button"
                      className="w-full flex items-center justify-center rounded-lg bg-gray-200 px-6 py-3 text-lg font-medium text-gray-700 hover:bg-gray-300"
                      onClick={clearCart}
                    >
                      Clear Cart
                    </button>
                  </div>
                  <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                    <p>
                      or{" "}
                      <button
                        type="button"
                        onClick={handleContinueShopping}
                        className="font-medium text-blue-600 hover:text-blue-500"
                      >
                        Continue Shopping <span aria-hidden="true">&rarr;</span>
                      </button>
                    </p>
                  </div>
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </div>
      <ToastContainer />
    </Dialog>
  );
};

export default Cart;
