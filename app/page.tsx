"use client";
import { confermaLogin } from "@/lib/login";
import { redirect } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  // const [ConfirmLogin, setConfirmLogin] = useState("");
  const [ConfirmLogin, setConfirmLogin] = useState(async () => {
    return await confermaLogin();
  });

  return redirect("/home");
}
