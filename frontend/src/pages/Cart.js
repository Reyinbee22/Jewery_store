import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';


import {
  Dialog,
  DialogTitle,
  DialogPanel,
  DialogBackdrop,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

const CartItem = ({ item, onRemove }) => {
  return (
    <li className="flex py-6">
      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
        <img
          alt={item.productId.name}
          src={item.productId.image || ""} // Default image if none provided
          className="h-full w-full object-cover object-center"
        />
      </div>

      <div className="ml-4 flex flex-1 flex-col">
        <div>
          <div className="flex justify-between text-base font-medium text-gray-900">
            <h3>{item.productId.name}</h3>
            <p className="ml-4">${item.productId.price * item.quantity}</p>
          </div>
          <p className="mt-1 text-sm text-gray-500">Qty {item.quantity}</p>
        </div>
        <div className="flex flex-1 items-end justify-between text-sm">
          <button
            type="button"
            className="font-medium text-blue-600 hover:text-blue-500"
            onClick={() => onRemove(item.productId._id, false)} // Pass false to indicate decrease quantity
          >
            Remove
          </button>
          
        </div>
      </div>
    </li>
  );
};
const Cart = () => {
  const [cart, setCart] = useState([]);
  const [open, setOpen] = useState(true); // Set to true to display the dialog initially
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const userId = JSON.parse(atob(token.split(".")[1])).userId; // Extract userId from token payload

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/cart", {
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
  }, [token]);

  const handleCheckout = () => {
    navigate("/checkout"); // Navigate to the checkout page
  };

  const handleContinueShopping = () => {
    navigate("/products"); // Navigate to the products page
  };

  const removeItem = async (productId, completeRemoval) => {
    try {
      if (completeRemoval) {
        // Remove item completely
        await axios.delete(`http://localhost:5000/api/cart/${productId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: { quantity: 1 }  // Default quantity to remove
        });
  
        setCart(
          (prevCart) =>
            prevCart.filter((item) => item.productId._id !== productId) // Remove the item
        );
      } else {
        await axios.delete(`http://localhost:5000/api/cart/${productId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: { quantity: 1 }  // update the remove item
        });

        // Decrease item quantity
        setCart(
          (prevCart) =>
            prevCart
              .map((item) =>
                item.productId._id === productId
                  ? { ...item, quantity: item.quantity - 1 }
                  : item
              )
              .filter((item) => item.quantity > 0) // Remove items with 0 quantity
        );
      }
    } catch (error) {
      console.error("Error updating item quantity:", error);
    }
  };
  

  const clearCart = async () => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/cart/clear/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setCart([]); // Clear the cart state
        toast.success('Cart cleared successfully');
      } else {
        throw new Error('Failed to clear the cart');
      }
    } catch (error) {
      console.error('Error clearing the cart:', error);
      toast.error('Failed to clear the cart');
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      className="relative z-10"
    >
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity duration-500 ease-in-out data-[closed]:opacity-0"
      />

      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
            <DialogPanel
              transition
              className="pointer-events-auto w-screen max-w-md transform transition duration-500 ease-in-out data-[closed]:translate-x-full sm:duration-700"
            >
              <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                  <div className="flex items-start justify-between">
                    <DialogTitle className="text-lg font-medium text-gray-900">
                      Shopping Cart
                    </DialogTitle>
                    <div className="ml-3 flex h-7 items-center">
                      <button
                        type="button"
                        onClick={() => setOpen(false)}
                        className="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
                      >
                        <span className="absolute -inset-0.5" />
                        <span className="sr-only">Close panel</span>
                        <XMarkIcon aria-hidden="true" className="h-6 w-6" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-8">
                    <div className="flow-root">
                      <ul
                        role="list"
                        className="-my-6 divide-y divide-gray-200"
                      >
                        {cart.map((item) => (
                          <CartItem
                            key={item.productId._id}
                            item={item}
                            onRemove={removeItem}
                          />
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                  <div className="flex justify-between text-base font-medium text-gray-900">
                    <p>Subtotal</p>
                    <p>
                      $
                      {cart
                        .reduce(
                          (total, item) =>
                            total + item.productId.price * item.quantity,
                          0
                        )
                        .toFixed(2)}
                    </p>
                  </div>
                  <p className="mt-0.5 text-sm text-gray-500">
                    Shipping and taxes calculated at checkout.
                  </p>
                  <div className="mt-6 flex justify-between gap-4">
                    <Button
                      type="primary"
                      className="flex items-center justify-center rounded-md border border-transparent bg-black px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-gray-700"
                      onClick={handleCheckout}
                    >
                      Checkout
                    </Button>
                    <Button
                      type="default"
                      className="flex items-center justify-center rounded-md border border-transparent bg-white px-6 py-3 text-base font-medium text-black shadow-sm hover:bg-gray-200"
                      onClick={clearCart}
                    >
                      Clear Cart
                    </Button>
                  </div>
                  <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                    <p>
                      or{" "}
                      <button
                        type="button"
                        onClick={handleContinueShopping}
                        className="font-medium text-indigo-600 hover:text-indigo-500"
                      >
                        Continue Shopping
                        <span aria-hidden="true"> &rarr;</span>
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
