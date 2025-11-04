'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
  const token = localStorage.getItem("token");

  if (token) {
    router.push("/accueil");
  }
}, []);


  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== passwordConfirm) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    try {
      const res = await fetch("http://localhost:3001/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (data.success) {
        router.push("/accueil");
      } else {
        setError(data.error);
      }
    } catch (err) {
      console.error(err);
      setError("Erreur serveur");
    }
  };

  return (
    <div className="bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 w-screen h-screen flex justify-center items-center">
      <div className="border-4 rounded-2xl w-150 h-120 flex flex-col items-center pt-6 gap-6 border-white">
        <p className="text-2xl font-bold text-white">Créer un compte</p>

        {error && <p className="text-red-500 font-semibold">{error}</p>}

        <form onSubmit={handleRegister} className="flex flex-col gap-4 w-80">
          <div className="flex flex-col gap-2">
            <label className="text-lg font-semibold text-gray-200">Mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Denis@gmail.com"
              className="w-full px-4 py-2 rounded-md bg-gray-800 text-white placeholder-gray-400 border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-400 outline-none transition"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-lg font-semibold text-gray-200">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="*****"
              className="w-full px-4 py-2 rounded-md bg-gray-800 text-white placeholder-gray-400 border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-400 outline-none transition"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-lg font-semibold text-gray-200">Confirmer le mot de passe</label>
            <input
              type="password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              placeholder="*****"
              className="w-full px-4 py-2 rounded-md bg-gray-800 text-white placeholder-gray-400 border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-400 outline-none transition"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full h-12 bg-linear-to-r from-rose-400 to-pink-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 cursor-pointer"
          >
            Créer
          </button>
        </form>

        <p className="mt-2 font-bold text-gray-200">
          Déjà un compte ? <a href="/connexion" className="underline">Clique ici !</a>
        </p>
      </div>
    </div>
  );
}
