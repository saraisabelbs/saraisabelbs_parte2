'use client';

import React, { useState, useEffect } from 'react';
import useSWR from 'swr';
import { Product } from '../models/interfaces';
import Card from '../../components/card';
import '../globals.css';
import Link from 'next/link';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Page() {
  const { data = [], error } = useSWR<Product[]>('https://deisishop.pythonanywhere.com/products/', fetcher, {
    fallbackData: [],
  });

  const [search, setSearch] = useState('');
  const [filteredData, setFilteredData] = useState<Product[]>([]);
  const [cart, setCart] = useState<Product[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  // Filtrar os dados com base na pesquisa
  useEffect(() => {
    const newFilteredData = data.filter((product) =>
      product.title.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredData(newFilteredData);
  }, [search, data]);

  // Carregar o carrinho do localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    }
  }, []);

  // Atualizar o localStorage quando o carrinho mudar
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart]);

  const addItemToCart = (product: Product) => setCart((prevCart) => [...prevCart, product]);

  const removeItemFromCart = (productId: number) =>
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));

  const handleBuy = () => {
    if (!cart.length) {
      alert('Carrinho vazio. Adicione produtos antes de comprar.');
      return;
    }

    fetch('https://deisishop.pythonanywhere.com/buy/', {
      method: 'POST',
      body: JSON.stringify({
        products: cart.map((product) => product.id),
        name: '',
        student: false,
        coupon: '',
      }),
      headers: { 'Content-Type': 'application/json' },
    })
      .then((response) => {
        if (!response.ok) throw new Error(`Erro: ${response.statusText}`);
        return response.json();
      })
      .then(() => {
        setCart([]);
        setModalMessage('Compra realizada com sucesso!');
        setShowModal(true);
      })
      .catch(() => {
        setModalMessage('Erro ao processar sua compra. Tente novamente.');
        setShowModal(true);
      });
  };

  if (error) return <div>Erro ao carregar os produtos.</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Produtos</h1>
      <nav className="mb-8">
        <ul className="flex space-x-4">
          <li>
            <Link href="/">Voltar</Link>
          </li>
        </ul>
      </nav>
      <input
        type="text"
        placeholder="Pesquisar produtos"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border rounded px-4 py-2 w-full sm:w-1/2"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8 mt-4">
        {filteredData.map((product) => (
          <Card key={product.id} product={product} addItemToCart={addItemToCart} />
        ))}
      </div>
      <div>
        <h2>Carrinho</h2>
        {cart.map((item) => (
          <div key={item.id}>
            <h3>{item.title}</h3>
            <button onClick={() => removeItemFromCart(item.id)}>Remover</button>
          </div>
        ))}
        <button onClick={handleBuy}>Comprar</button>
      </div>
      {typeof window !== 'undefined' && showModal && (
        <div>
          <div>
            <p>{modalMessage}</p>
            <button onClick={() => setShowModal(false)}>Fechar</button>
          </div>
        </div>
      )}
    </div>
  );
}