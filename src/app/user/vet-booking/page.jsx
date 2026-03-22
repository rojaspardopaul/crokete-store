import { redirect } from "next/navigation";
import VetBookingClient from "@components/vet/VetBookingClient";
import {
  getPublicVetConfig,
  getActiveVeterinarians,
  getMyPets,
  getMyPriceInfo,
} from "@services/VetServices";
import { getUserServerSession } from "@lib/auth-server";

export const metadata = {
  title: "Agendar Consulta Veterinaria | Crokete Pet",
  description: "Agenda una consulta veterinaria en línea para tu mascota",
};

export default async function VetBookingPage() {
  const user = await getUserServerSession();
  if (!user) {
    redirect("/login");
  }

  const [configResult, vetsResult, petsResult, priceResult] = await Promise.all(
    [
      getPublicVetConfig(),
      getActiveVeterinarians(),
      getMyPets(),
      getMyPriceInfo(),
    ]
  );

  const config = configResult.data;
  const veterinarians = vetsResult.data || [];
  const pets = petsResult.data?.pets || [];
  const priceInfo = priceResult.data || {};

  // If vet system is disabled, show message
  if (!config?.enabled) {
    return (
      <div className="text-center py-16">
        <div className="text-5xl mb-4">🩺</div>
        <h3 className="text-lg font-semibold text-gray-600">
          Consultas veterinarias próximamente
        </h3>
        <p className="text-gray-400 mt-2">
          Estamos preparando este servicio para ti. ¡Vuelve pronto!
        </p>
      </div>
    );
  }

  return (
    <VetBookingClient
      config={config}
      veterinarians={veterinarians}
      pets={pets}
      priceInfo={priceInfo}
      token={user?.token}
    />
  );
}
