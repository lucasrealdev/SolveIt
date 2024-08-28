import { Link } from "expo-router";
import React from "react";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PiFunnelSimpleBold } from "react-icons/pi";

export default function Page() {
  return (
    <View className="tela-add-problemas">

      <Header />
      <Content />
    </View>
  );
}

function Header() {
  return (
    <header className="bg-gray-950 font-mono text-xl p-2 flex items-center justify-between relative">
      <div className="box-border h-8 w-8 p-5 border-2 rounded-3xl absolute right-6 top-3.5"></div>

      <div className="flex flex-col justify-start ml-aut">
        <p className="text-white font-mono p-2 py-0">Oi,Laura👋</p>
        <p className="text-white font-mono text-xs p-2 pt-2">Explore o Mundo</p>
      </div>
    </header>
  );
}

function Content() {
  return (
    <><div className="bg-gray-950 pr-4 pl-3 py-0">

      <input type="text" placeholder="Procurar Problemas"
        className="bg-gray-950 text-white font-mono w-full py-2 px-2 pr-0 border-2 border-gray-300 rounded-xl 
        shadow-sm focus:outline-none top-1"
      ></input>
      <div className="absolute inset-y-0 right-4 absolute items-center justify-end top-16 pl-3 p-4 text-3xl">

        <PiFunnelSimpleBold className="text-white" />
      </div>
    </div>

      <div className="bg-gray-950 text-white py-3 p-4 font-mono text-basel text-xl">Cite seu problema</div>

      <div className="flex justify-center bg-gray-950 p-6">
        <div className="box-border h-40 w-96 p-4 border-2 rounded-xl border-gray-900 bg-white flex items-center justify-center pt-8">
          <article className="text-wrap">
            <h3 className="font-bold font-mono text-left">Obrigado por ajudar o mundo a se tornar um lugar melhor 🌎</h3>
            <p className="font-mono text-gray-500 text-left">Seu problema pode ser a proxima grande solucao, se ninguem tem problemas as inovacoes acabam</p>
          </article>
        </div>
      </div>

      <p className="text-white bg-gray-950 top-96 left-72 justify-center font-mono text-center">1. Dê um título ao seu problema</p>

        <main className="bg-gray-950 h-screen justify-center items-center">
          <div className=" bg-gray-950 justify-center flex items-center left-20 right m-10">
            <input type="text" placeholder="Ex: Dificuldade em encontrar taxis disponiveis"
              className="bg-gray-900 text-white p-2 border-2 border-gray-500 rounded-md w-96"></input>

          </div>
        </main>

    </>


  )


}