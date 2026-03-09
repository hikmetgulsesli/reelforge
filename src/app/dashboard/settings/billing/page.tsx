import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { DashboardLayout } from "@/components/dashboard";

export default async function BillingSettingsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const user = {
    name: session.user?.name,
    email: session.user?.email,
    image: session.user?.image,
  };

  return (
    <DashboardLayout user={user} credits={3} plan="Free" title="Faturalama">
      <div className="bg-[var(--color-surface-dark)] rounded-2xl p-8 border border-[var(--color-surface-hover)]">
        <h2 className="text-xl font-display font-bold text-white mb-4">
          Faturalama
        </h2>
        <p className="text-[var(--color-text-muted-dark)]">
          Faturalama yakında kullanıma açılacak.
        </p>
      </div>
    </DashboardLayout>
  );
}