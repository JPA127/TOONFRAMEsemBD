import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, UserPlus, UserMinus, Search } from "lucide-react";
import { useUser, Friend } from "../contexts/UserContext";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { MANNEQUIN_FRIENDS } from "../../lib/store";

interface SelectFriendsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Lista de usuários sugeridos para adicionar como amigos
const suggestedUsers: Friend[] = [
  ...MANNEQUIN_FRIENDS,
  {
    id: 5,
    name: "Roberto Lima",
    username: "@robertol",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
  },
  {
    id: 6,
    name: "Fernanda Souza",
    username: "@fernandasouza",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
  },
  {
    id: 7,
    name: "Lucas Martins",
    username: "@lucasm",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
  },
  {
    id: 8,
    name: "Patrícia Alves",
    username: "@patriciaa",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
  },
  {
    id: 9,
    name: "Bruno Santos",
    username: "@brunos",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
  },
  {
    id: 10,
    name: "Amanda Rodrigues",
    username: "@amandar",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop",
  },
  {
    id: 11,
    name: "Rafael Costa",
    username: "@rafaelc",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop",
  },
  {
    id: 12,
    name: "Juliana Ferreira",
    username: "@julianaf",
    image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop",
  },
];

export function SelectFriendsModal({ open, onOpenChange }: SelectFriendsModalProps) {
  const { friends, addFriend, removeFriend } = useUser();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"current" | "suggested">("current");

  const currentFriends = friends;
  const notFriends = suggestedUsers.filter(
    (user) => !friends.some((f) => f.id === user.id)
  );

  const filteredCurrent = currentFriends.filter(
    (friend) =>
      friend.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      friend.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSuggested = notFriends.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-neutral-900 border-4 border-black dark:border-neutral-400 max-w-3xl w-full max-h-[90vh] overflow-hidden z-50 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:shadow-[12px_12px_0px_0px_rgba(255,255,255,0.25)] flex flex-col">
          <div className="bg-blue-500 dark:bg-blue-600 border-b-4 border-black dark:border-neutral-400 p-6 flex-shrink-0">
            <div className="flex items-center justify-between mb-4">
              <Dialog.Title className="text-2xl font-black text-white">
                GERENCIAR AMIGOS
              </Dialog.Title>
              <Dialog.Close className="hover:bg-black/10 p-2 transition-colors">
                <X className="w-6 h-6 text-white" />
              </Dialog.Close>
            </div>
            <Dialog.Description className="sr-only">
              Adicione ou remova amigos e veja sugestões de usuários para seguir
            </Dialog.Description>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar usuários..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border-4 border-black dark:border-neutral-400 dark:bg-neutral-900 px-4 py-3 pl-12 focus:outline-none focus:ring-4 focus:ring-yellow-400"
              />
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b-4 border-black dark:border-neutral-400 flex bg-gray-100 dark:bg-neutral-800 flex-shrink-0">
            <button
              onClick={() => setActiveTab("current")}
              className={`flex-1 px-6 py-4 font-black transition-colors ${
                activeTab === "current"
                  ? "bg-white dark:bg-neutral-900 border-r-4 border-black dark:border-neutral-400"
                  : "hover:bg-gray-200 dark:hover:bg-neutral-700"
              }`}
            >
              MEUS AMIGOS ({friends.length})
            </button>
            <button
              onClick={() => setActiveTab("suggested")}
              className={`flex-1 px-6 py-4 font-black transition-colors ${
                activeTab === "suggested"
                  ? "bg-white dark:bg-neutral-900 border-l-4 border-black dark:border-neutral-400"
                  : "hover:bg-gray-200 dark:hover:bg-neutral-700"
              }`}
            >
              SUGESTÕES ({notFriends.length})
            </button>
          </div>

          <div className="p-6 overflow-y-auto flex-1">
            {activeTab === "current" && (
              <div className="space-y-3">
                {filteredCurrent.length === 0 ? (
                  <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                    Nenhum amigo encontrado
                  </p>
                ) : (
                  filteredCurrent.map((friend) => (
                    <div
                      key={friend.id}
                      className="bg-white dark:bg-neutral-900 border-4 border-black dark:border-neutral-400 p-4 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.25)] transition-shadow flex items-center gap-4"
                    >
                      <div className="w-16 h-16 border-2 border-black dark:border-neutral-400 bg-gray-100 dark:bg-neutral-800 overflow-hidden flex-shrink-0">
                        <ImageWithFallback
                          src={friend.image}
                          alt={friend.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-black text-lg truncate">
                          {friend.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                          {friend.username}
                        </p>
                      </div>
                      <button
                        onClick={() => removeFriend(friend.id)}
                        className="bg-red-500 dark:bg-red-700 text-white px-4 py-2 font-black hover:bg-red-600 dark:hover:bg-red-800 transition-colors border-2 border-black dark:border-neutral-400 flex items-center gap-2 whitespace-nowrap"
                      >
                        <UserMinus className="w-4 h-4" />
                        REMOVER
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === "suggested" && (
              <div className="space-y-3">
                {filteredSuggested.length === 0 ? (
                  <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                    Nenhuma sugestão disponível
                  </p>
                ) : (
                  filteredSuggested.map((user) => (
                    <div
                      key={user.id}
                      className="bg-white dark:bg-neutral-900 border-4 border-black dark:border-neutral-400 p-4 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.25)] transition-shadow flex items-center gap-4"
                    >
                      <div className="w-16 h-16 border-2 border-black dark:border-neutral-400 bg-gray-100 dark:bg-neutral-800 overflow-hidden flex-shrink-0">
                        <ImageWithFallback
                          src={user.image}
                          alt={user.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-black text-lg truncate">
                          {user.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                          {user.username}
                        </p>
                      </div>
                      <button
                        onClick={() => addFriend(user)}
                        className="bg-blue-500 dark:bg-blue-600 text-white px-4 py-2 font-black hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors border-2 border-black dark:border-neutral-400 flex items-center gap-2 whitespace-nowrap"
                      >
                        <UserPlus className="w-4 h-4" />
                        ADICIONAR
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          <div className="border-t-4 border-black dark:border-neutral-400 p-6 bg-gray-50 dark:bg-neutral-900 flex-shrink-0">
            <button
              onClick={() => onOpenChange(false)}
              className="w-full bg-blue-500 dark:bg-blue-600 text-white px-8 py-3 font-black hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors border-4 border-black dark:border-neutral-400 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.25)]"
            >
              CONCLUIR
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}