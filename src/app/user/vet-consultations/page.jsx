import { redirect } from "next/navigation";
import VetConsultationsClient from "@components/vet/VetConsultationsClient";
import { getMyPets, getMyAppointments } from "@services/VetServices";
import { getUserServerSession } from "@lib/auth-server";

export const metadata = {
  title: "Consultas Veterinarias | Crokete Pet",
  description:
    "Gestiona tus consultas veterinarias en línea y las mascotas registradas",
};

export default async function VetConsultationsPage() {
  const user = await getUserServerSession();
  if (!user) {
    redirect("/login");
  }

  const [petsResult, appointmentsResult] = await Promise.all([
    getMyPets(),
    getMyAppointments(),
  ]);

  const pets = petsResult.data?.pets || [];
  const appointments = appointmentsResult.data?.appointments || [];

  return (
    <VetConsultationsClient
      initialPets={pets}
      initialAppointments={appointments}
      token={user?.token}
    />
  );
}
