import { FoamPilotClient } from '@/components/foam-pilot-client';
import { Header } from '@/components/header';

export default function Home() {
  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <Header />
      <main className="flex-1 overflow-hidden">
        <FoamPilotClient />
      </main>
    </div>
  );
}
