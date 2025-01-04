// Importando o tipo Product
import { Product } from '../app/models/interfaces';

interface CardProps {
  product: Product; // Definindo o tipo do produto
  addItemToCart: (product: Product) => void; // Definindo o tipo para a função de adicionar ao carrinho
}

const Card = ({ product, addItemToCart }: CardProps) => {
  return (
    <div className="flex flex-col items-center justify-between p-4 border rounded-lg shadow-lg">
      {/* Imagem do produto */}
      <img 
        src={product.image} 
        alt={product.title} 
        className="w-full h-48 object-cover mb-4 rounded-lg"
      />
      
      {/* Título do produto */}
      <h3 className="text-xl font-semibold text-center mb-2">{product.title}</h3>
      
      {/* Descrição do produto */}
      <p className="text-sm text-center mb-2">{product.description}</p>
      
      {/* Preço do produto */}
      <p className="font-bold mb-4">${product.price}</p>
      
      {/* Botão de adicionar ao carrinho */}
      <button
        onClick={() => addItemToCart(product)}
        className="bg-blue-500 text-white py-2 px-4 rounded-full hover:bg-blue-600"
      >
        Adicionar ao Carrinho
      </button>
    </div>
  );
};

export default Card;