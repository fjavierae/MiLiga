import { redirect } from "next/navigation";
import { UserRole } from "@/types";
import { getSession } from "@/lib/auth";
import { Navbar } from "@/app/components/navbar/Navbar";
import PlayerDashboard from "./PlayerDashboard";

export default async function PlayerDashboardPage() {
  const session = await getSession();

  if (!session || session.role !== UserRole.PLAYER) {
    redirect("/");
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Navbar role={UserRole.PLAYER} userName={typeof session.email === "string" ? session.email : undefined} />
      <main style={{ flex: 1, padding: "1rem" }}>
        <PlayerDashboard />
      </main>
    </div>
  );
}
