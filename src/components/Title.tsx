import React from "react";

interface TitleH1Props {
  text: string;
}

//Componente para poder importarlos estilos de los titulos de cada page sin tener que repetir los mismos estilos para cada uno
const Title: React.FC<TitleH1Props> = ({ text }) => {
  return (
    <h1 className="text-[#003366] text-center font-montserrat text-3xl font-bold mb-4 mt-6">
      <span className="inline-block border-b-2 border-black px-4 pb-2">
        {text}
      </span>
    </h1>
  );
};

export default Title;
