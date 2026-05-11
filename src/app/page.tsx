// Página raiz — redireciona para a dashboard
import { redirect } from "next/navigation";

export default function Home() {
  redirect("/dashboard");
}
