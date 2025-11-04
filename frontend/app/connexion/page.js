'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";



export default function Page() {
  const [mail, setMail] = useState("");
  const [pass, setPass] = useState("");
  const router = useRouter();
  const [error, setError] = useState("");



  const handleLogin = async (e) => {
    e.preventDefault();


    if (mail && pass) {
      try {
      const res = await fetch("http://localhost:3001/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: mail, password: pass })
      });

      const data = await res.json();

      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.user.id);
        router.push("/accueil");
      } else {
        setError(data.error);
      }
    }
      catch (err) {
      console.error(err);
      setError("Erreur serveur");
    }
    }
      

  }

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      router.push("/accueil")
    }
  }, [])

  

  return (
    <>
    <div className="bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 w-screen h-screen flex justify-center items-center">
  
    <form onSubmit={handleLogin}>
      <div className="border-4 rounded-2xl w-150 h-120 flex flex-col items-center pt-6 gap-6 border-white">
      <div className="flex flex-col">

        <p className="text-2xl font-bold text-white">Connexion</p>
        <div className="border-b border-white"></div>
      </div>

      <div className="flex flex-col gap-2 w-80 mx-auto mt-2">
      <label className="text-lg font-semibold text-gray-200">Mail</label>
      <input
        type="email"
        value={mail}
        onChange={(e) => setMail(e.target.value)}
        required
        placeholder="Denis@gmail.com"
        className="w-full px-4 py-2 rounded-md bg-gray-800 text-white placeholder-gray-400 border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-400 outline-none transition"
      />
      </div>

      <div className="flex flex-col gap-2 w-80 mx-auto mt-1">
      <label className="text-lg font-semibold text-gray-200">Password</label>
      <input
        type="password"
        required
        value={pass}
        onChange={(e) => setPass(e.target.value)}
        placeholder="*****"
        className="w-full px-4 py-2 rounded-md bg-gray-800 text-white placeholder-gray-400 border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-400 outline-none transition"
      />
      </div>

      <div className="mt-2">

        <div className="mt-2 bg-red-800 rounded-md w-60 mb-3 flex justify-center">
        {error && <span className="text-white font-bold">{error}</span>}
        </div>

        <button 
        type="submit"
        className="w-60 h-12 bg-linear-to-r from-rose-400 to-pink-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 cursor-pointer">
        Connexion
        </button>
      </div>

      <div className="mt-2">
        <p className="font-bold text-white">Pas encore de compte ? Créez-en un <span><a href="/register">ici !</a></span></p>
      </div>

    </div>
    </form>
    
    </div>


    
    
    </>
  );
}

