"use client";

import { useEffect, useState } from "react";
import { getUserSession } from "@lib/auth-client";
import requests from "@services/httpServices";
import LoyaltyHomeWidget from "@components/loyalty/LoyaltyHomeWidget";

const OfferCard = () => {
  const userInfo = getUserSession();
  const [rewards, setRewards] = useState([]);

  // Fetch available rewards for logged-in users (for the coupon preview)
  useEffect(() => {
    if (!userInfo?.token) return;
    const fetchRewards = async () => {
      try {
        requests.defaults.headers.common["Authorization"] = `Bearer ${userInfo.token}`;
        const data = await requests.get("/loyalty/rewards");
        setRewards(data?.available || []);
      } catch {
        // silently fail
      }
    };
    fetchRewards();
  }, [userInfo?.token]);

  return <LoyaltyHomeWidget rewards={rewards} />;
};

export default OfferCard;
