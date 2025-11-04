'use client';

import { useEffect, useState } from "react";

export default function Page() {
  const [mail, setMail] = useState(null);
  const [pass, setPass] = useState(null);

 

  return (
    <>
    <div className="bg-black w-screen h-screen flex items-center justify-center">

      <a href="/connexion"><button className="relative w-40 h-10 rounded-2xl bg-white text-black font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-transform duration-300 ease-out cursor-pointer">
      Connecte-toi
      </button></a>

    </div>
    
    
    </>
  );
}
