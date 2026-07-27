import React from "react";
import UsersView from "@/views/users/users.view";
import { getAllUsersAction } from "@/controllers/user.controller";

interface PageProps {
  searchParams: Promise<{ page?: string; limit?: string; search?: string }>;
}

export default async function UsersPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = parseInt(params.page || "1");
  const limit = parseInt(params.limit || "50");
  const search = params.search || "";

  const result = await getAllUsersAction({ page, limit, search });

  return (
    <UsersView
      initialResult={result}
      initialSearch={search}
    />
  );
}
