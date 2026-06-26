import { ConnectionPanel } from "@/components/ConnectionPanel";
import { LogPanel } from "@/components/LogPanel";
import { StatusBar } from "@/components/StatusBar";
import { ToolsCatalog } from "@/components/ToolsCatalog";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-4 p-4 sm:p-6">
        <StatusBar />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1.15fr]">
          <section className="space-y-4">
            <ConnectionPanel />
            <ToolsCatalog />
          </section>
          <section>
            <LogPanel />
          </section>
        </div>
      </main>
    </div>
  );
}
