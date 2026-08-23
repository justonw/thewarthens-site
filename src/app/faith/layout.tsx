export default function FaithLayout({ children }: LayoutProps<"/faith">) {
  return <div className="theme-light min-h-screen bg-background text-foreground">{children}</div>;
}
