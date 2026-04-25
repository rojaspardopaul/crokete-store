import { redirect } from "next/navigation";
import RewardsClient from "@components/user-dashboard/RewardsClient";
import {
  getMyLoyalty,
  getPointHistory,
  getAvailableRewards,
} from "@services/LoyaltyServices";
import { getUserServerSession } from "@lib/auth-server";

export const metadata = {
  title: "Mis Recompensas | Crokete Pet",
  description: "Consulta tus puntos, hitos y recompensas de nuestro programa de lealtad",
};

export default async function RewardsPage() {
  const user = await getUserServerSession();
  if (!user) {
    redirect("/login");
  }

  const [loyaltyResult, historyResult, rewardsResult] = await Promise.all([
    getMyLoyalty(),
    getPointHistory(1, 30),
    getAvailableRewards(),
  ]);

  return (
    <RewardsClient
      loyaltyData={loyaltyResult.data}
      historyData={historyResult.data}
      rewardsData={rewardsResult.data}
      token={user?.token}
    />
  );
}
