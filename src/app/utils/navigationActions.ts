"use server";

import { redirect } from "next/navigation";

export async function navigateHome() {
  redirect(`/pages/home`);
}

export async function navigateLogin() {
  redirect("/pages/login");
}

export async function navigateRoutines() {
  redirect("/pages/routines");
}

export async function navigateEditRoutines(routineId?: number) {
  redirect(`/pages/edit-routine${routineId ? `?routineId=${routineId}` : ""}`);
}

// export async function navigateHome(data: FormData) {
//   redirect(`/posts/${data.get('id')}`)
// }
