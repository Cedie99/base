import { auth } from "@/lib/auth";
import { PublicHeader } from "@/components/public/public-header";
import { PublicFooter } from "@/components/public/public-footer";
import { CompareProvider } from "@/components/compare/compare-provider";
import { CompareBar } from "@/components/compare/compare-bar";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <CompareProvider>
      <div className="flex min-h-screen flex-col bg-white dark:bg-black">
        <PublicHeader user={session?.user} />
        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-10">
          {children}
        </main>
        <PublicFooter />
      </div>
      <CompareBar />
    </CompareProvider>
  );
}
