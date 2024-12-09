import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useState } from "react";
import metas from "../assets/metas.png";
import bcrypt from "bcryptjs";

interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  cpf: string; // Adicione o campo CPF aqui
}

interface LoginProps {
  onSignupClick: () => void;
  onLoginSuccess: (user: User) => void;
}

export default function Login({ onSignupClick, onLoginSuccess }: LoginProps) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cpf, setCpf] = useState("");

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCpf(e.target.value);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch("http://localhost:3333/users", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Erro ao carregar usuários");
      }

      const data = await response.json();
      console.log("Resposta da API:", data);

      if (Array.isArray(data.users)) {
        const user = data.users.find((u: User) => u.email === email);

        if (user) {
          const isCpfValid = bcrypt.compareSync(cpf, user.cpf);

          if (isCpfValid) {
            handleCloseModal();
            onLoginSuccess(user);
          } else {
            setError("CPF inválido");
          }
        } else {
          setError("Usuário não encontrado");
        }
      } else {
        setError("A resposta da API não contém um array de usuários");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao fazer login";
      setError(errorMessage);
    }
  };

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:3333/users", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Erro ao carregar usuários");
      }

      const data = await response.json();
      console.log("Resposta da API:", data);

      if (Array.isArray(data.users)) {
        const user = data.users.find((u: User) => u.email === email);

        if (user) {
          const isPasswordValid = bcrypt.compareSync(password, user.password);

          if (isPasswordValid) {
            setIsModalOpen(true);
          } else {
            setError("Email ou senha inválidos");
          }
        } else {
          setError("Email ou senha inválidos");
        }
      } else {
        setError("A resposta da API não contém um array de usuários");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao fazer login";
      setError(errorMessage);
    }
  };

  return (
    <div className="flex h-screen">
      <div
        className="w-[70%] bg-cover bg-center hidden lg:block"
        style={{ backgroundImage: `url(${metas})` }}
      />
      <div className="w-full lg:w-[30%] flex items-center justify-center bg-gray-900">
        <div className="w-full max-w-md p-8 space-y-6">
          <h2 className="text-3xl font-bold text-center text-violet-50">
            Login
          </h2>
          {error && <p className="text-red-500 text-center">{error}</p>}
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
                className="w-full bg-zinc-800 text-white placeholder-zinc-400"
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                className="w-full bg-zinc-800 text-white placeholder-zinc-400"
              />
            </div>
            <div>
              <Button
                variant="primary"
                size="default"
                className="w-full"
                type="button"
                onClick={handleLogin}
              >
                Login
              </Button>
            </div>
            {isModalOpen && (
              <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
                <div className="bg-white p-6 rounded shadow-lg">
                  <h2 className="text-xl mb-4 text-black">
                    Digite seu CPF para continuar
                  </h2>
                  <label className="block mb-2 text-black">
                    CPF:
                    <input
                      type="text"
                      value={cpf}
                      onChange={handleCpfChange}
                      className="border p-2 w-full"
                    />
                  </label>
                  <div className="flex justify-end">
                    <Button
                      type="button"
                      className="w-full"
                      onClick={handleCloseModal}
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="button"
                      className="w-full"
                      onClick={handleSubmit}
                    >
                      Confirmar
                    </Button>
                  </div>
                </div>
              </div>
            )}
            <p className="mt-6 text-center text-sm text-gray-500">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={onSignupClick}
                className="font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none cursor-pointer"
              >
                Sign Up here
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
