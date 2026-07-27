import React from "react";

export const ROLE_STYLES: Record<string, { badge: string; avatar: string; label: string }> = {
  admin: {
    badge: "bg-rose-50 text-rose-700 border-rose-200",
    avatar: "bg-rose-100 text-rose-700",
    label: "Administrador",
  },
  muni: {
    badge: "bg-sky-50 text-sky-700 border-sky-200",
    avatar: "bg-sky-100 text-sky-700",
    label: "Municipal",
  },
  user: {
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    avatar: "bg-emerald-100 text-emerald-700",
    label: "Ciudadano",
  },
};

export const getInitials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join("");

interface UserRoleBadgeProps {
  roleName?: string;
}

export const UserRoleBadge: React.FC<UserRoleBadgeProps> = ({ roleName = "user" }) => {
  const style = ROLE_STYLES[roleName] ?? ROLE_STYLES.user;
  return (
    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${style.badge}`}>
      {style.label}
    </span>
  );
};

interface UserAvatarProps {
  name: string;
  roleName?: string;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({ name, roleName = "user" }) => {
  const style = ROLE_STYLES[roleName] ?? ROLE_STYLES.user;
  return (
    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold ${style.avatar}`}>
      {getInitials(name)}
    </div>
  );
};
