import { redirect } from "next/navigation";
import { UserRole } from "@/types";
import { getSession } from "@/lib/auth";
import { Navbar } from "@/app/components/navbar/Navbar";
import AdminDashboard from "./AdminDashboard";

export default async function AdminDashboardPage() {
  const session = await getSession();

  if (!session || session.role !== UserRole.ADMIN) {
    redirect("/");
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Navbar role={UserRole.ADMIN} userName={typeof session.email === "string" ? session.email : undefined} />
      <main style={{ flex: 1, padding: "1rem" }}>
        <AdminDashboard />
      </main>
    </div>
  );
}
