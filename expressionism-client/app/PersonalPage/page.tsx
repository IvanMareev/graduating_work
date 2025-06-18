"use client";

import { useEffect, useState } from "react";

import userInfoServices from "../services/userInfoServices";
import tokenInfoServices from "../services/tokenInfoServices";
import { useRouter } from "next/navigation"; 
import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute";

const PersonalPage = () => {
  const [userInfo, setUserInfo] = useState<any>(null);
  const [tokenInfo, setTokenInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true); 
  const router = useRouter();
  useEffect(() => {
    if (userInfo || tokenInfo) return; 

    async function fetchData() {
      try {
        const userInfoResponse = await userInfoServices();
        const tokenInfoResponse = await tokenInfoServices();
        setTokenInfo(tokenInfoResponse)
        console.log(tokenInfoResponse);
        

        if (!userInfoResponse || !tokenInfoResponse) {
          return 0;
        }

        setUserInfo(userInfoResponse);
        setTokenInfo(tokenInfoResponse);
      } catch (error) {
        
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [router]);

  if (loading) {
    return <div>Загрузка...</div>;
  }

  return (
  //@ts-ignore
  <>
  {tokenInfo  ? (
      <div>
        <h1>Информация о пользователе</h1>
        <p><strong>Имя:</strong> {userInfo.username}</p>
        <p><strong>ID:</strong> {userInfo.id}</p>
        <h1>Информация о токене</h1>
        <p><strong>time_left_seconds:</strong> {tokenInfo.time_left_seconds}</p>
        <p><strong>expires_at:</strong> {tokenInfo.expires_at}</p>
      </div>
    ) : router.push("/auth/signin")}
  </>
    

  );
};

export default PersonalPage;
