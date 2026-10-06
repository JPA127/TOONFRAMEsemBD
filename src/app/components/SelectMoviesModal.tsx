import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, Heart, Plus, Check } from "lucide-react";
import { useUser, FavoriteMovie } from "../contexts/UserContext";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface SelectMoviesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Lista expandida de animações disponíveis
const availableMovies: FavoriteMovie[] = [
  {
    id: 1,
    title: "A Viagem de Chihiro",
    year: "2001",
    image: "https://geaa.art.br/wp-content/uploads/2020/12/IMAGEM-2-1024x554.jpg",
  },
  {
    id: 2,
    title: "Spider-Man: Aranhaverso",
    year: "2018",
    image: "https://mis-sp.org.br/wp-content/uploads/2019/05/WCRXtZVepgMvc3h8kPvUwfzGHpIn0ff7r20W1TsD.jpeg",
  },
  {
    id: 3,
    title: "Naruto",
    year: "2002",
    image: "https://sm.ign.com/ign_pt/cover/n/naruto/naruto_m8zh.jpg",
  },
  {
    id: 4,
    title: "Wall-E",
    year: "2008",
    image: "https://ecoaliza.com.br/wp-content/uploads/2018/12/wall-e-ecoaliza.jpg",
  },
  {
    id: 5,
    title: "Toy Story",
    year: "1995",
    image: "https://upload.wikimedia.org/wikipedia/pt/5/50/Toy_Story.jpg",
  },
  {
    id: 6,
    title: "O Rei Leão",
    year: "1994",
    image: "https://lumiere-a.akamaihd.net/v1/images/p_thelionking_19752_1_0b9de87b.jpeg",
  },
  {
    id: 7,
    title: "Procurando Nemo",
    year: "2003",
    image: "https://prod-ripcut-delivery.disney-plus.net/v1/variant/disney/8E7616B84CE1DA09C77672145CDB626BC34AED7A96CE1F547B67322CF16D4BEE/scale?width=1200&aspectRatio=1.78&format=webp",
  },
  {
    id: 8,
    title: "Arcane",
    year: "2021",
    image: "https://dnm.nflximg.net/api/v6/6gmvu2hxdfnQ55LZZjyzYR4kzGk/AAAABbxh8B5a3w3fgNLMdEqLFHLlLqYc4Y8QBPaZMCPHZLjGxZqd3W0TmSPvPLr8TTuuJpN7hM7LLbhNNdJZiZAGsPP2A_b3A_WYhTkECNDM5qCJj5p5StEQrRV0RyJmrY2sxQ0lMH6JHKcGD1GWcuq7mxC_tSKxzNdOvw.jpg",
  },
  {
    id: 9,
    title: "Dragon Ball Z",
    year: "1989",
    image: "https://m.media-amazon.com/images/M/MV5BNGM5MTEyZDItZWNhOS00NzNjLTgzNTEtNjAzNmQxNTBmNzVlXkEyXkFqcGdeQXVyNTA4NzY1MzY@._V1_.jpg",
  },
  {
    id: 10,
    title: "Avatar: A Lenda de Aang",
    year: "2005",
    image: "https://m.media-amazon.com/images/M/MV5BNWMxMjA1OTYtMWZlOS00MzNmLWJjNDgtMjNhNzNhYjU4YjY4XkEyXkFqcGdeQXVyMTEzMTI1Mjk3._V1_.jpg",
  },
  {
    id: 11,
    title: "Frozen",
    year: "2013",
    image: "https://lumiere-a.akamaihd.net/v1/images/p_frozen_18369_3131a740.jpeg",
  },
  {
    id: 12,
    title: "Klaus",
    year: "2019",
    image: "https://m.media-amazon.com/images/M/MV5BMWYwOThjM2ItZGYxNy00NTQwLWFlZWEtM2MzM2Q5MmY3NDU5XkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_.jpg",
  },
];

export function SelectMoviesModal({ open, onOpenChange }: SelectMoviesModalProps) {
  const { favoriteMovies, addFavoriteMovie, removeFavoriteMovie } = useUser();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredMovies = availableMovies.filter((movie) =>
    movie.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isSelected = (movieId: number) => {
    return favoriteMovies.some((m) => m.id === movieId);
  };

  const toggleMovie = (movie: FavoriteMovie) => {
    if (isSelected(movie.id)) {
      removeFavoriteMovie(movie.id);
    } else {
      addFavoriteMovie(movie);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white border-4 border-black max-w-4xl w-full max-h-[90vh] overflow-hidden z-50 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] flex flex-col">
          <div className="bg-orange-500 border-b-4 border-black p-6 flex-shrink-0">
            <div className="flex items-center justify-between mb-4">
              <Dialog.Title className="text-2xl font-black text-white">
                GERENCIAR OBRAS FAVORITAS
              </Dialog.Title>
              <Dialog.Close className="hover:bg-black/10 p-2 transition-colors">
                <X className="w-6 h-6 text-white" />
              </Dialog.Close>
            </div>
            <Dialog.Description className="sr-only">
              Selecione suas animações favoritas para exibir no seu perfil
            </Dialog.Description>
            <input
              type="text"
              placeholder="Buscar animações..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border-4 border-black px-4 py-3 focus:outline-none focus:ring-4 focus:ring-yellow-400"
            />
          </div>

          <div className="p-6 overflow-y-auto flex-1">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {filteredMovies.map((movie) => {
                const selected = isSelected(movie.id);
                return (
                  <button
                    key={movie.id}
                    onClick={() => toggleMovie(movie)}
                    className={`bg-white border-4 overflow-hidden hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all group text-left relative ${
                      selected ? "border-orange-500" : "border-black"
                    }`}
                  >
                    <div className="relative h-48 bg-gray-100 overflow-hidden">
                      <ImageWithFallback
                        src={movie.image}
                        alt={movie.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      {selected && (
                        <div className="absolute inset-0 bg-orange-500/80 flex items-center justify-center">
                          <div className="w-12 h-12 bg-white border-4 border-black rounded-full flex items-center justify-center">
                            <Check className="w-6 h-6 text-orange-500" />
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <h3 className="font-black text-sm mb-1 line-clamp-2">
                        {movie.title}
                      </h3>
                      <p className="text-xs text-gray-600">{movie.year}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="border-t-4 border-black p-6 bg-gray-50 flex-shrink-0">
            <div className="flex items-center justify-between">
              <p className="font-black">
                {favoriteMovies.length} OBRA{favoriteMovies.length !== 1 ? "S" : ""} SELECIONADA{favoriteMovies.length !== 1 ? "S" : ""}
              </p>
              <button
                onClick={() => onOpenChange(false)}
                className="bg-orange-500 text-white px-8 py-3 font-black hover:bg-orange-600 transition-colors border-4 border-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              >
                CONCLUIR
              </button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}