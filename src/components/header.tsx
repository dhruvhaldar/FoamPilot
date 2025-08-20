import { Logo } from './logo';
import { SidebarTrigger } from './ui/sidebar';

export function Header() {
  return (
    <header className="relative flex items-center justify-center h-16 px-4 border-b bg-background/80 backdrop-blur-sm shrink-0">
      <div className="absolute left-4 flex items-center gap-2">
        <SidebarTrigger />
      </div>
      <Logo className="w-auto h-8 text-primary" />
    </header>
  );
}
