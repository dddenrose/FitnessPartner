import React from "react";
import ProtectedRoute from "@/app/components/ProtectedRoute";

// This HOC can be used to wrap any component that requires authentication
export function withAuth<P extends object>(Component: React.ComponentType<P>) {
  return function WithAuth(props: P): JSX.Element {
    return (
      <ProtectedRoute>
        <Component {...props} />
      </ProtectedRoute>
    );
  };
}
