import { redirect } from "next/navigation";
import { UserRole } from "@/types";
import { getSession } from "@/lib/auth";
import { Navbar } from "@/app/components/navbar/Navbar";
import ManagerDashboard from "./ManagerDashboard";
import { getPendingJoinRequests } from "@/actions/manager";

export default async function ManagerTeamPage() {
  const session = await getSession();

  if (!session || session.role !== UserRole.MANAGER) {
    redirect("/");
  }

  const pendingJoinRequests = await getPendingJoinRequests();

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Navbar role={UserRole.MANAGER} userName={typeof session.email === "string" ? session.email : undefined} />
      <main style={{ flex: 1, padding: "1rem" }}>
        <ManagerDashboard pendingRequestsCount={pendingJoinRequests.length} />
      </main>
    </div>
  );
}
