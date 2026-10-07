import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { useUser } from "../contexts/UserContext";
import { ImageUploadField } from "./ImageUploadField";

interface EditProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditProfileModal({ open, onOpenChange }: EditProfileModalProps) {
  const { userProfile, updateProfile } = useUser();
  const [formData, setFormData] = useState({
    name: userProfile.name,
    username: userProfile.username,
    bio: userProfile.bio,
    profileImage: userProfile.profileImage,
    coverImage: userProfile.coverImage,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData);
    onOpenChange(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white border-4 border-black max-w-2xl w-full max-h-[90vh] overflow-y-auto z-50 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
          <div className="bg-yellow-400 border-b-4 border-black p-6 sticky top-0 z-10">
            <div className="flex items-center justify-between">
              <Dialog.Title className="text-2xl font-black">
                EDITAR PERFIL
              </Dialog.Title>
              <Dialog.Close className="hover:bg-black/10 p-2 transition-colors">
                <X className="w-6 h-6" />
              </Dialog.Close>
            </div>
            <Dialog.Description className="sr-only">
              Edite as informações do seu perfil, incluindo foto, nome e biografia
            </Dialog.Description>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Cover Image */}
            <div>
              <label className="block font-black mb-3">IMAGEM DE CAPA</label>
              <ImageUploadField
                variant="cover"
                maxDimension={1200}
                value={formData.coverImage}
                onChange={(v) => setFormData({ ...formData, coverImage: v })}
              />
            </div>

            {/* Profile Image */}
            <div>
              <label className="block font-black mb-3">FOTO DE PERFIL</label>
              <ImageUploadField
                variant="avatar"
                maxDimension={320}
                value={formData.profileImage}
                onChange={(v) => setFormData({ ...formData, profileImage: v })}
              />
            </div>

            {/* Name */}
            <div>
              <label className="block font-black mb-3">NOME</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full border-4 border-black px-4 py-3 focus:outline-none focus:ring-4 focus:ring-blue-500"
                required
              />
            </div>

            {/* Username */}
            <div>
              <label className="block font-black mb-3">NOME DE USUÁRIO</label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                className="w-full border-4 border-black px-4 py-3 focus:outline-none focus:ring-4 focus:ring-blue-500"
                required
              />
            </div>

            {/* Bio */}
            <div>
              <label className="block font-black mb-3">BIO</label>
              <textarea
                value={formData.bio}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
                rows={4}
                className="w-full border-4 border-black px-4 py-3 focus:outline-none focus:ring-4 focus:ring-blue-500 resize-none"
                placeholder="Conte um pouco sobre você..."
              />
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                className="flex-1 bg-blue-500 text-white px-6 py-4 font-black hover:bg-blue-600 transition-colors border-4 border-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              >
                SALVAR ALTERAÇÕES
              </button>
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="flex-1 bg-white text-black px-6 py-4 font-black hover:bg-gray-100 transition-colors border-4 border-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              >
                CANCELAR
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}