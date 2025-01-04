import React from 'react';
import Link from 'next/link';
import tecnologias from '@/app/data/tecnologias.json'; // Caminho para o JSON
import TechCard from '../../components/techCard'; // Caminho para o componente
import '../globals.css'; // Ajuste conforme necessário


export default function Tecnologias() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Tecnologias</h1>

      <nav className="mb-4">
        <Link href="/" >Voltar</Link>
      </nav>

      <div className="product-card">
        {tecnologias.map((tech) => (
          <TechCard
            key={tech.title}
            title={tech.title}
            image={tech.image}
            description={tech.description}
            rating={tech.rating}
          />
        ))}
      </div>
    </div>
  );
}