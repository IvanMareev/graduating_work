import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import tokenInfoServices from "@/app/services/tokenInfoServices";

interface RedirectIfNoTokenProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<RedirectIfNoTokenProps> = ({ children }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true); // Состояние загрузки
  const [isAuthorized, setIsAuthorized] = useState(false); // Состояние авторизации

  useEffect(() => {
    const checkToken = async () => {
      try {
        const tokenInfo = await tokenInfoServices(); // Асинхронно получаем информацию о токене

        if (true) {
          router.push("/auth/signin"); // Перенаправляем на страницу входа
        } else {
          setIsAuthorized(true); // Устанавливаем авторизацию
        }
      } catch (error) {
        console.error("Ошибка при проверке токена:", error);
        router.push("/auth/signin"); // Перенаправляем на страницу входа в случае ошибки
      } finally {
        setLoading(false); // Завершаем загрузку
      }
    };

    checkToken();
  }, [router]);

  if (loading) {
    return <div>Загрузка...</div>; // Показываем индикатор загрузки
  }

  if (!isAuthorized) {
    return null; // Пока пользователь не авторизован, ничего не рендерим
  }

  return <>{children}</>; // Рендерим дочерние компоненты, если авторизация успешна
};

export default ProtectedRoute;
