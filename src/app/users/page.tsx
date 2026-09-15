import React from "react";
import UsersView from "@/views/users/users.view";
import { getAllUsersAction } from "@/controllers/user.controller";
import { getCurrentUser } from "@/lib/session";

interface PageProps {
  searchParams: Promise<{ page?: string; limit?: string; search?: string }>;
}

export default async function UsersPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = parseInt(params.page || "1");
  const limit = parseInt(params.limit || "50");
  const search = params.search || "";

  const [result, user] = await Promise.all([
    getAllUsersAction({ page, limit, search }),
    getCurrentUser()
  ]);

  return (
    <UsersView
      initialResult={result}
      initialSearch={search}
      currentUserRole={user?.role || ""}
    />
  );
}
