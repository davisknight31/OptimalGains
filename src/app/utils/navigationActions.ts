"use server";

import { redirect } from "next/navigation";

export async function navigateHome() {
  redirect(`/pages/home`);
}

// export async function navigateHome(data: FormData) {
//   redirect(`/posts/${data.get('id')}`)
// }
