import { Logo } from './logo';
import { SidebarTrigger } from './ui/sidebar';

export function Header() {
  return (
    <header className="flex items-center h-16 px-4 border-b bg-background/80 backdrop-blur-sm shrink-0">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="md:hidden" />
        <Logo className="w-auto h-8 text-primary" />
      </div>
    </header>
  );
}
