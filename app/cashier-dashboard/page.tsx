import React from "react";

const CashierDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center pt-16">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-blue-600 text-center mb-6">
          Dashboard Caissier
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Bienvenue sur votre espace de vente.
          <br />
          Ici, vous pouvez gérer les transactions et suivre les ventes en temps
          réel.
        </p>
        <div className="flex flex-col gap-4">
          <button className="py-3 rounded-md bg-blue-600 text-white font-semibold text-base hover:bg-blue-700 transition-colors">
            Nouvelle Vente
          </button>
          <button className="py-3 rounded-md bg-yellow-400 text-gray-900 font-semibold text-base hover:bg-yellow-500 transition-colors">
            Historique des Ventes
          </button>
          <button className="py-3 rounded-md bg-red-500 text-white font-semibold text-base hover:bg-red-600 transition-colors">
            Déconnexion
          </button>
        </div>
      </div>
    </div>
  );
};

export default CashierDashboard;
