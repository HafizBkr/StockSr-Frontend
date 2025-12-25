"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import InputWithIcon from "../components/InputWithIcon";
import PrimaryButton from "../components/PrimaryButton";

const CashierLoginPage = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Simuler une authentification (à remplacer par un appel API réel)
    setTimeout(() => {
      setLoading(false);
      if (username === "caissier" && password === "password") {
        router.push("/cashier-dashboard");
      } else {
        setError("Identifiants invalides. Veuillez réessayer.");
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f4f7fa] via-[#e9eef5] to-[#e3e8f0]">
      <div className="w-full max-w-4xl mx-4 rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden bg-white/70 backdrop-blur-lg">
        {/* Partie gauche */}
        <div className="md:w-1/2 bg-blue-600 flex flex-col items-center justify-center p-10 text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-2 text-center">
            Bienvenue
          </h2>
          <div className="text-lg font-medium mb-1 text-center opacity-90">
            Espace Caissier
          </div>
          <p className="mb-8 mt-2 text-center opacity-90">
            Accédez à la gestion des ventes et du stock en toute simplicité.
          </p>
          <div className="flex justify-center">
            <Image
              src="/cashier.png"
              alt="Illustration caisse"
              width={220}
              height={160}
              className="rounded-lg shadow-lg bg-white"
              priority
            />
          </div>
        </div>
        {/* Partie droite */}
        <div className="md:w-1/2 flex flex-col justify-center p-8 md:p-12 bg-white">
          <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              Connexion Caissier
            </h3>
            <p className="text-gray-500 mb-6 text-sm">
              Veuillez entrer vos identifiants pour accéder à l&apos;espace
              caissier.
            </p>
            <InputWithIcon
              label="Nom d'utilisateur"
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Nom d'utilisateur"
              autoFocus
              icon={
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16 21v-2a4 4 0 00-8 0v2M12 11a4 4 0 100-8 4 4 0 000 8z"
                  />
                </svg>
              }
              containerClassName="mb-4"
            />
            <InputWithIcon
              label="Mot de passe"
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Mot de passe"
              icon={
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 11c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm0 0v2m0 4h.01"
                  />
                </svg>
              }
              rightIcon={
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword((v) => !v)}
                  className="focus:outline-none"
                  aria-label={
                    showPassword
                      ? "Masquer le mot de passe"
                      : "Afficher le mot de passe"
                  }
                >
                  {showPassword ? (
                    // Eye open
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm6 0c0 5-4.03 9-9 9S3 17 3 12 7.03 3 12 3s9 4 9 9z"
                      />
                    </svg>
                  ) : (
                    // Eye closed
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.97 0-9-4-9-7 0-1.306.835-2.417 2.22-3.293m3.34-1.712A9.956 9.956 0 0112 5c4.97 0 9 4 9 7 0 1.306-.835 2.417-2.22 3.293M15 12a3 3 0 11-6 0 3 3 0 016 0zm-6.364 6.364L6 18m12 0l-1.636-1.636M3 3l18 18"
                      />
                    </svg>
                  )}
                </button>
              }
              containerClassName="mb-4"
            />
            {error && (
              <div className="text-red-600 mb-4 text-center text-sm font-medium">
                {error}
              </div>
            )}
            <PrimaryButton type="submit" loading={loading} className="mt-2">
              Se connecter
            </PrimaryButton>
            <div className="mt-4 text-center text-sm text-gray-500">
              Problème de connexion ?{" "}
              <a href="#" className="text-blue-600 hover:underline">
                Contactez l&apos;administrateur
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CashierLoginPage;
