import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../../lib/auth";
import { DashboardLayout } from "@/components/dashboard";
import Link from "next/link";
import {
  PlusCircle,
  FileVideo,
  BarChart3,
  ShoppingCart,
  Film,
  Cpu,
  Brush,
} from "lucide-react";

export default async function DashboardPage() {
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
    <DashboardLayout user={user} credits={3} plan="Free" title="Ana Kontrol Paneli">
      {/* Top Section: Credits & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Credit Balance Widget */}
        <div className="col-span-1 bg-[var(--color-surface-dark)] rounded-2xl p-6 border border-[var(--color-surface-hover)] flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4">
            <svg
              className="w-10 h-10 text-[var(--color-text-muted-dark)]/30"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <circle cx="12" cy="12" r="10" />
            </svg>
          </div>
          <h3 className="text-[var(--color-text-muted-dark)] text-sm font-medium mb-4 self-start">
            Kredi Bakiyesi
          </h3>
          <div className="relative flex items-center justify-center size-32 mb-2">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                className="text-[var(--color-surface-hover)]"
                cx="50"
                cy="50"
                fill="transparent"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
              />
              <circle
                className="text-primary"
                cx="50"
                cy="50"
                fill="transparent"
                r="40"
                stroke="currentColor"
                strokeDasharray="251.2"
                strokeDashoffset="188.4"
                strokeWidth="8"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-display font-bold text-white">3</span>
            </div>
          </div>
          <p className="text-xs text-[var(--color-text-muted-dark)] mt-2">
            Bu ay %25 kullanıldı
          </p>
        </div>

        {/* Quick Actions */}
        <div className="col-span-1 lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            href="/dashboard/create"
            className="flex flex-col items-center justify-center gap-3 bg-primary/10 hover:bg-primary/20 border border-primary/20 rounded-2xl p-6 transition-all group"
          >
            <div className="size-12 rounded-full bg-primary/20 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
              <PlusCircle className="w-6 h-6" />
            </div>
            <span className="text-white text-sm font-medium">Yeni Video</span>
          </Link>
          <Link
            href="/dashboard/library"
            className="flex flex-col items-center justify-center gap-3 bg-[var(--color-surface-dark)] hover:bg-[var(--color-surface-hover)] border border-[var(--color-surface-hover)] rounded-2xl p-6 transition-all group"
          >
            <div className="size-12 rounded-full bg-[var(--color-surface-hover)] text-secondary flex items-center justify-center group-hover:scale-110 transition-transform">
              <FileVideo className="w-6 h-6" />
            </div>
            <span className="text-white text-sm font-medium">Kütüphaneye Göz At</span>
          </Link>
          <Link
            href="/dashboard/analytics"
            className="flex flex-col items-center justify-center gap-3 bg-[var(--color-surface-dark)] hover:bg-[var(--color-surface-hover)] border border-[var(--color-surface-hover)] rounded-2xl p-6 transition-all group"
          >
            <div className="size-12 rounded-full bg-[var(--color-surface-hover)] text-[var(--color-text-muted-dark)] flex items-center justify-center group-hover:text-white group-hover:scale-110 transition-all">
              <BarChart3 className="w-6 h-6" />
            </div>
            <span className="text-[var(--color-text-muted-dark)] group-hover:text-white text-sm font-medium transition-colors">
              Analizleri Görüntüle
            </span>
          </Link>
          <Link
            href="/dashboard/settings/billing"
            className="flex flex-col items-center justify-center gap-3 bg-[var(--color-surface-dark)] hover:bg-[var(--color-surface-hover)] border border-[var(--color-surface-hover)] rounded-2xl p-6 transition-all group"
          >
            <div className="size-12 rounded-full bg-[var(--color-surface-hover)] text-[var(--color-text-muted-dark)] flex items-center justify-center group-hover:text-white group-hover:scale-110 transition-all">
              <ShoppingCart className="w-6 h-6" />
            </div>
            <span className="text-[var(--color-text-muted-dark)] group-hover:text-white text-sm font-medium transition-colors">
              Kredi Satın Al
            </span>
          </Link>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-[var(--color-surface-dark)] rounded-xl p-5 border border-[var(--color-surface-hover)] flex items-center justify-between">
          <div>
            <p className="text-[var(--color-text-muted-dark)] text-sm mb-1">Toplam Video</p>
            <h4 className="text-white text-2xl font-display font-bold">0</h4>
          </div>
          <div className="size-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <Film className="w-5 h-5" />
          </div>
        </div>
        <div className="bg-[var(--color-surface-dark)] rounded-xl p-5 border border-[var(--color-surface-hover)] flex items-center justify-between">
          <div>
            <p className="text-[var(--color-text-muted-dark)] text-sm mb-1">
              Bu Haftaki Renderlar
            </p>
            <h4 className="text-white text-2xl font-display font-bold">0</h4>
          </div>
          <div className="size-10 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center">
            <Cpu className="w-5 h-5" />
          </div>
        </div>
        <div className="bg-[var(--color-surface-dark)] rounded-xl p-5 border border-[var(--color-surface-hover)] flex items-center justify-between">
          <div>
            <p className="text-[var(--color-text-muted-dark)] text-sm mb-1">Favori Stil</p>
            <h4 className="text-white text-lg font-display font-bold">-</h4>
          </div>
          <div className="size-10 rounded-lg bg-fuchsia-500/10 text-fuchsia-400 flex items-center justify-center">
            <Brush className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-8">
        <h3 className="text-white text-lg font-display font-bold mb-4">Son Aktiviteler</h3>
        <div className="bg-[var(--color-surface-dark)] rounded-2xl border border-[var(--color-surface-hover)] overflow-hidden">
          <div className="p-8 text-center">
            <p className="text-[var(--color-text-muted-dark)]">
              Henüz aktivite yok. İlk videonuzu oluşturun!
            </p>
            <Link
              href="/dashboard/create"
              className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              Yeni Video Oluştur
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}