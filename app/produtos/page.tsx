'use client';

import React, { useState, useEffect } from 'react';
import useSWR from 'swr';
import { Product } from '../models/interfaces';
import Card from '../../components/card';
import '../globals.css';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Page() {
  const { data, error, isLoading } = useSWR<Product[]>('https://deisishop.pythonanywhere.com/products/', fetcher);

  const [search, setSearch] = useState(''); // Estado para a pesquisa
  const [filteredData, setFilteredData] = useState<Product[]>([]); // Estado para os produtos filtrados
  const [cart, setCart] = useState<Product[]>([]); // Estado para o carrinho
  const [isClient, setIsClient] = useState(false); // Estado para controlar a renderização no cliente
  const [showModal, setShowModal] = useState(false); // Controla a exibição do pop-up
  const [modalMessage, setModalMessage] = useState(''); // Mensagem do modal

  // Atualizar o filteredData sempre que o search ou o data mudarem
  useEffect(() => {
    if (data) {
      const newFilteredData = data.filter((product) =>
        product.title.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredData(newFilteredData);
    }
  }, [search, data]);

  // Garantir que o código de cliente é executado após a renderização inicial
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsClient(true); // Só execute após a renderização no cliente
    }
  }, []);

  // Carregar os produtos do carrinho do localStorage
  useEffect(() => {
    if (isClient) {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    }
  }, [isClient]);

  // Atualizar o localStorage sempre que o carrinho mudar
  useEffect(() => {
    if (isClient) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart, isClient]);

  // Função para adicionar um item ao carrinho
  const addItemToCart = (product: Product) => {
    setCart((prevCart) => [...prevCart, product]);
  };

  // Função para remover um item do carrinho
  const removeItemFromCart = (productId: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const handleBuy = () => {
    const cartProductIds = cart.map((product) => product.id); // Obter os IDs dos produtos no carrinho
    
    // Verifique se o carrinho está vazio antes de enviar a requisição
    if (cartProductIds.length === 0) {
      alert("Carrinho vazio. Adicione produtos ao carrinho antes de comprar.");
      return;
    }
  
    fetch("https://deisishop.pythonanywhere.com/buy/", {
      method: "POST",
      body: JSON.stringify({
        products: cartProductIds, // IDs dos produtos no carrinho
        name: "", // Nome do usuário (adicione um campo para capturar o nome)
        student: false, // Status de estudante
        coupon: "", // Cupom (adicione um campo para capturar o cupom)
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
      .then((response) => {
        console.log("Resposta da API de compra:", response);
        setCart([]); // Limpar o carrinho após a compra
        setModalMessage('Compra realizada com sucesso!');
        setShowModal(true); // Exibir a mensagem de sucesso
      })
      .catch((error) => {
        console.log("Erro ao realizar a compra:", error);
        setModalMessage('Ocorreu um erro ao processar sua compra. Tente novamente.');
        setShowModal(true); // Exibir a mensagem de erro
      });
  };

  if (error) return <div>Erro ao carregar os produtos.</div>;
  if (isLoading || !data) return <div>A carregar...</div>;

  return (
    <div>
      <div>
        <h1>Bem-vindo à nossa Loja</h1>
        <p>Veja nossos produtos abaixo:</p>
      </div>

      {/* Input de pesquisa */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Pesquisar produtos"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded px-4 py-2 w-full sm:w-1/2"
        />
      </div>

      {/* Exibição dos produtos */}
      <div className="container mx-auto px-4 mt-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
          {filteredData.map((product) => (
            <Card key={product.id} product={product} addItemToCart={addItemToCart} />
          ))}
        </div>
      </div>

      {/* Exibição do carrinho */}
      <div className="cart">
        <h2>Carrinho</h2>
        <div className="cart-items">
          {cart.map((item, index) => (
            <div key={index} className="cart-item">
              <img src={item.image} alt={item.title} className="cart-item-image" />
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <p>Preço: ${item.price}</p>
              {/* Botão para remover o item */}
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

        {/* Botão para realizar a compra */}
        <button
          onClick={handleBuy}
          className="buy-button bg-blue-500 text-white p-2 rounded"
        >
          Comprar
        </button>
      </div>

      {/* Pop-up de confirmação de compra */}
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