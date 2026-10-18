// Gera (ou converte) a senha de um perfil manequim.
//   node scripts/gerar-senha.mjs            -> cria uma senha aleatória nova
//   node scripts/gerar-senha.mjs MinhaSenha -> usa a senha informada
// Copie "passwordSalt" e "passwordHash" para o perfil em src/lib/store.ts (SEED_USERS).
// Só o hash vai para o código; a senha em si deve ser enviada ao dono por um canal privado.
import { createHash, randomBytes, randomInt } from "node:crypto";

const ALFABETO = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";

function senhaAleatoria() {
  const bruto = Array.from({ length: 12 }, () => ALFABETO[randomInt(ALFABETO.length)]).join("");
  return `${bruto.slice(0, 4)}-${bruto.slice(4, 8)}-${bruto.slice(8)}`;
}

const senha = process.argv[2] ?? senhaAleatoria();
const sal = randomBytes(8).toString("hex");
const hash = createHash("sha256").update(`${sal}:${senha}`, "utf8").digest("hex");

console.log(`senha:        ${senha}`);
console.log(`passwordSalt: "${sal}",`);
console.log(`passwordHash: "${hash}",`);
