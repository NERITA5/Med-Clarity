"use server"

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function saveProfile(formData: {
  age: number;
  sex: string;
  weight?: number;
  height?: number;
  conditions?: string;
  symptoms?: string;
}) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const profile = await prisma.userProfile.upsert({
    where: { clerkId: userId },
    update: {
      age: formData.age,
      sex: formData.sex,
      weight: formData.weight,
      height: formData.height,
      conditions: formData.conditions,
      symptoms: formData.symptoms,
    },
    create: {
      clerkId: userId,
      age: formData.age,
      sex: formData.sex,
      weight: formData.weight,
      height: formData.height,
      conditions: formData.conditions,
      symptoms: formData.symptoms,
    },
  });

  revalidatePath("/dashboard");
  return profile;
}