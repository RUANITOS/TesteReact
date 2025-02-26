'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { MagnifyingGlassIcon } from "@heroicons/react/16/solid";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export type ProductType = {
  name: string;
  image: string;
  model: string;
  treadwear: number;
  traction: string;
  temperature: string;
  pattern: string;
  loadIndex: string;
  speedRating: string;
  cars: string[];
};

export default function Products() {
  const { data, error } = useSWR<ProductType[]>('/api/products', fetcher);
  const [search, setSearch] = useState('');

  if (error) return <div className="text-center text-red-500">Erro ao carregar os produtos.</div>;
  if (!data) return <div className="text-center text-gray-500">Carregando...</div>;

  const filteredProducts = data.filter((product) => {
    const searchTerms = search.toLowerCase().split(' ');
    return searchTerms.every(term =>
      product.name.toLowerCase().includes(term) ||
      product.cars.some(car => car.toLowerCase().includes(term))
    );
  });

  return (
    <div className="w-full flex justify-center flex-col h-full">
      {/* Seção de pesquisa mantida intacta */}
      <div className="border-gray-500 w-1/2 mx-auto mb-4">
        <label htmlFor="search" className="block text-sm/6 font-medium text-gray-900">
          Pesquisa
        </label>
        <div className="mt-2 grid grid-cols-1">
          <input
            id="search"
            name="search"
            type="search"
            placeholder="Pesquisar produtos"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="col-start-1 row-start-1 block w-full rounded-md bg-white py-1.5 pl-10 pr-3 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:pl-9 sm:text-sm/6"
          />
          <MagnifyingGlassIcon
            aria-hidden="true"
            className="pointer-events-none col-start-1 row-start-1 ml-3 size-5 self-center text-gray-400 sm:size-4"
          />
        </div>
      </div>

      {/* Lista de produtos */}
      <div className="space-y-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div
              key={product.name}
              className="bg-white p-6 rounded-xl shadow-md border border-gray-200"
              data-testid="product"
            >
              {/* Layout do produto mantido intacto */}
              <div className="flex gap-6">
                <div className="flex flex-col">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-24 h-24 object-contain mb-2"
                  />
                  <span className="text-lg font-bold text-gray-900">
                    {product.model}
                  </span>
                </div>

                <div className="border-l-2 border-black h-auto mr-4" />

                <div className="flex-1">
                  <div className="mb-4">
                    <h2 className="text-lg font-bold text-gray-900">
                      {product.name}
                    </h2>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    {/* Coluna 1 */}
                    <div className="space-y-2">
                      <div>
                        <div className="text-sm text-gray-400">Durabilidade</div>
                        <div className="font-bold text-gray-900">{product.treadwear}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-400">Índice de velocidade</div>
                        <div className="font-bold text-gray-900">{product.speedRating}</div>
                      </div>
                    </div>

                    {/* Coluna 2 */}
                    <div className="space-y-2">
                      <div>
                        <div className="text-sm text-gray-400">Tração</div>
                        <div className="font-bold text-gray-900">{product.traction}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-400">Capacidade de carga</div>
                        <div className="font-bold text-gray-900">{product.loadIndex}</div>
                      </div>
                    </div>

                    {/* Coluna 3 */}
                    <div className="space-y-2">
                      <div>
                        <div className="text-sm text-gray-400">Temperatura</div>
                        <div className="font-bold text-gray-900">{product.temperature}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-400">Desenho</div>
                        <div className="font-bold text-gray-900">{product.pattern}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500">Nenhum produto encontrado</div>
        )}
      </div>
    </div>
  );
}