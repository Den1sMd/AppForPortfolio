'use client';
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";




export default function Page() {

  const [userresult, setUserresult] = useState("");
  const [random1, setRandom1] = useState(null);
  const [random2, setRandom2] = useState(null);
  const [money, setMoney] = useState(0);
  const [streak, setStreak] = useState(0);
  const router = useRouter();

  const result = random1 + random2;

  const logout = async (e) => {
    e.preventDefault();
    localStorage.clear();
    router.push("/connexion")
  }

  
  

  useEffect(() => {
    const max = 1000;
    setRandom1(Math.floor(Math.random() * max));
    setRandom2(Math.floor(Math.random() * max));
  }, []);

  useEffect(() => {
  const fetchProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const res = await fetch("http://localhost:3001/profile", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    const data = await res.json();
    if (res.ok) {
      setMoney(data.money);
      setStreak(data.streak);
    } else {
      console.error(data.error);
    }
  };

  fetchProfile();
}, []);
  
  const userCalc = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (parseInt(userresult) === result) {
        


        const res = await fetch("http://localhost:3001/calcul", {
        method: "POST",
        headers: { "Content-Type": "application/json",
                   "Authorization": `Bearer ${token}`,
         },
      });

      const data = await res.json();
      if (res.ok) {
        setMoney(data.money);
        setStreak(data.streak);

        const max = 1000;
        setRandom1(Math.floor(Math.random() * max));
        setRandom2(Math.floor(Math.random() * max));
        setUserresult("");
      } else {
        alert(data.error);
      }
    }
    else {
      alert("Mauvaise réponse, réessaie !");

      const max = 1000;
        setRandom1(Math.floor(Math.random() * max));
        setRandom2(Math.floor(Math.random() * max));
        setUserresult("");
      
      const res = await fetch("http://localhost:3001/endstreak", {
        method: "GET",
        headers: { "Content-Type": "application/json",
                   "Authorization": `Bearer ${token}`,
         },
      });

      const data = await res.json();
      if (res.ok) {
        setStreak(data.streak);
      }

      else {
        alert(data.error);
      }
    }
  }

   useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/connexion");
    }
  }, [router]);



  return (
    <div className="w-screen h-screen bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 flex justify-center items-center flex-col">
      <div className="mb-2">
        <p className="text-2xl text-white">Mes Statistiques :</p>
      </div>
      <div className="bg-linear-to-l from-pink-500 to-blue-500 w-40 mb-10 h-10 flex flex-row gap-15 border border-white rounded-2xl">
            <div className="flex flex-row  gap-2 justify-center items-center">
              <img className="w-7 ml-3" src="/svgviewer-output.svg"></img>
              <p className="text-white">{money}</p>
            </div>

             <div className="flex flex-row gap-2 justify-center items-center pr-2">
              <img className="w-7" src="/fire.svg"></img>
              <p className="text-white">{streak}</p>
            </div>
          </div>
      <form 
      onSubmit={userCalc}
      className="bg-linear-to-r from-pink-500 to-blue-500 w-120 h-120 border border-white rounded-2xl flex justify-center pt-20"
>
        <div className="flex-col flex items-center">
            <div className="flex flex-col gap-1">
                <p className="font-bold text-3xl text-white">Bienvenue</p>
                <div className="border-b border-white"></div>
            </div>

            <p className="font-bold mt-5 text-lg text-white">Résous ces calculs et empoche tes Coins !</p>

            <div className="border border-white mt-10 rounded-md w-50 h-10 flex flex-row">
                <div className="flex-row flex justify-center items-center gap-10 ml-5">
                    <p className="font-bold text-lg text-white">{random1}</p>
                    <p className="font-bold text-lg text-white">+</p>
                    <p className="font-bold text-lg text-white">{random2}</p>
                </div>
            </div>

            <label className="mt-4 text-white">Entre ta réponse ici :</label>
            <input
            type="text"
            placeholder="32"
            className="bg-linear-to-l from-pink-500 to-blue-500 mt-2 rounded-md items-center px-1 border border-white text-white focus:border-blue-500 focus:ring-2 focus:ring-white outline-none transition"
            required
            value={userresult}
            onChange={(e) => setUserresult(e.target.value)}
            >
            
            </input>

            <button
  type="submit"
  className="bg-linear-to-r from-pink-500 to-blue-500 text-white font-bold mt-10 px-6 py-2 rounded-xl shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300 cursor-pointer"
>
  Vérifier
</button>


            <p className="mt-10 font-bold text-white">Ceci est une version beta.</p>
        </div>
      </form>

      <form 
      onSubmit={logout}
      >
        <div className="mt-8 bg-red-800 w-40 h-10 flex justify-center rounded-2xl hover:scale-105 hover:shadow-xl transition-all duration-300">
        <button 
        type="submit"
        className="text-white font-bold cursor-pointer">Déconnexion</button>
      </div>
      </form>
    </div>
  );
}
