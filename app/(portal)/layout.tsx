import Navbar from "@/components/portal/Navbar";

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Navbar>
      <div className="flex flex-col min-h-[calc(100vh-8rem)]">
        <div className="flex-1 animate-in fade-in slide-in-from-bottom-2 duration-500">
          {children}
        </div>
        
        <footer className="mt-12 border-t border-gray-200 pt-8 pb-4">
          <div className="text-center">
            <p className="text-gray-400 text-[10px] sm:text-xs text-textBold uppercase tracking-widest leading-relaxed">
              &copy; {new Date().getFullYear()} Tamarind Group. Helpdesk Portal.
            </p>
          </div>
        </footer>
      </div>
    </Navbar>
  );
}
