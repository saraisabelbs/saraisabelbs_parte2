'use client';

import React, { useState, useEffect } from 'react';
import useSWR from 'swr';
import { Product } from '../models/interfaces';
import Card from '../../components/card';
import '../globals.css';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Page() {
  const { data, error, isLoading } = useSWR<Product[]>('https://deisishop.pythonanywhere.com/products/', fetcher);

  const [search, setSearch] = useState('');
  const [filteredData, setFilteredData] = useState<Product[]>([]);
  const [cart, setCart] = useState<Product[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  useEffect(() => {
    if (data) {
      const newFilteredData = data.filter((product) =>
        product.title.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredData(newFilteredData);
    }
  }, [search, data]);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addItemToCart = (product: Product) => {
    setCart((prevCart) => [...prevCart, product]);
  };

  const removeItemFromCart = (productId: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const handleBuy = () => {
    const cartProductIds = cart.map((product) => product.id);

    if (cartProductIds.length === 0) {
      alert("Carrinho vazio. Adicione produtos ao carrinho antes de comprar.");
      return;
    }

    fetch("https://deisishop.pythonanywhere.com/buy/", {
      method: "POST",
      body: JSON.stringify({
        products: cartProductIds,
        name: "",
        student: false,
        coupon: "",
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Erro na requisição: ${response.statusText}`);
        }
        return response.json();
      })
      .then(() => {
        setCart([]);
        setModalMessage('Compra realizada com sucesso!');
        setShowModal(true);
      })
      .catch(() => {
        setModalMessage('Ocorreu um erro ao processar sua compra. Tente novamente.');
        setShowModal(true);
      });
  };

  if (error) return <div>Erro ao carregar os produtos.</div>;
  if (isLoading || !data) return <div>A carregar...</div>;

  return (
    <div>
      <header>
        <h1>Bem-vindo à nossa Loja</h1>
      </header>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Pesquisar produtos"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded px-4 py-2 w-full sm:w-1/2"
        />
      </div>

      <div className="container mx-auto px-4 mt-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
          {filteredData.map((product) => (
            <Card key={product.id} product={product} addItemToCart={addItemToCart} />
          ))}
        </div>
      </div>

      <div className="cart">
        <h2>Carrinho</h2>
        <div className="cart-items">
          {cart.map((item, index) => (
            <div key={index} className="cart-item">
              <img src={item.image} alt={item.title} className="cart-item-image" />
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <p>Preço: ${item.price}</p>
              <button
                onClick={() => removeItemFromCart(item.id)}
                className="remove-button bg-red-500 text-white p-2 rounded"
              >
                Remover
              </button>
            </div>
          ))}
        </div>
        <div className="cart-total">
          <p>Total: ${cart.reduce((total, item) => total + item.price, 0).toFixed(2)}</p>
        </div>

        <button
          onClick={handleBuy}
          className="buy-button bg-pink-300 text-white p-2 rounded"
        >
          Comprar
        </button>
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <p>{modalMessage}</p>
            <button onClick={() => setShowModal(false)} className="close-button">
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
