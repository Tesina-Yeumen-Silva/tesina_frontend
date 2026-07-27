"use server";

import {
  userService,
  GetUsersQuery,
  CreateUserData,
  UpdateUserData,
  RoleOption,
} from "@/services/user.service";
import type { ActionResult, ApiResponse, User } from "@/models";
import { toFailure } from "@/lib/validation";

export async function getAllUsersAction(
  query: GetUsersQuery
): Promise<ActionResult<ApiResponse<User[]>>> {
  try {
    const response = await userService.getAllUsers(query);
    return {
      ok: true,
      data: response,
    };
  } catch (error) {
    return toFailure(error);
  }
}

export async function createUserAction(
  data: CreateUserData
): Promise<ActionResult<User>> {
  try {
    const user = await userService.createUser(data);
    return { ok: true, data: user };
  } catch (error) {
    return toFailure(error);
  }
}

export async function updateUserAction(
  id: number,
  data: UpdateUserData
): Promise<ActionResult<User>> {
  try {
    const user = await userService.updateUser(id, data);
    return { ok: true, data: user };
  } catch (error) {
    return toFailure(error);
  }
}

export async function deleteUserAction(
  id: number
): Promise<ActionResult<{ message: string }>> {
  try {
    const res = await userService.deleteUser(id);
    return { ok: true, data: res };
  } catch (error) {
    return toFailure(error);
  }
}

export async function updateUserPasswordAction(
  id: number,
  password: string
): Promise<ActionResult<{ message: string }>> {
  try {
    const res = await userService.updateUserPassword(id, password);
    return { ok: true, data: res };
  } catch (error) {
    return toFailure(error);
  }
}

export async function getRolesAction(): Promise<ActionResult<RoleOption[]>> {
  try {
    const roles = await userService.getRoles();
    return { ok: true, data: roles };
  } catch (error) {
    return toFailure(error);
  }
}
