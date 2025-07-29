"use client";

import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "@/lib/features/userInfo/userInfoSlice";
import { useEffect } from "react";
import { Spin } from "antd";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const router = useRouter();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const loading = useSelector((state: any) => state.userInfo.loading);

  useEffect(() => {
    // If auth has been checked and user is not authenticated
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Spin size="large">
          <div
            className="p-12 rounded-md flex flex-col items-center justify-center"
            style={{ minHeight: "120px", minWidth: "200px" }}
          >
            <div className="text-center mt-4">Loading...</div>
          </div>
        </Spin>
      </div>
    );
  }

  // Only render children if authenticated
  return isAuthenticated ? <>{children}</> : null;
};

export default ProtectedRoute;
