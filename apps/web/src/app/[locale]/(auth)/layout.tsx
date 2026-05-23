// apps/web/src/app/[locale]/(auth)/layout.tsx
// LoginForm and RegisterForm own their full-screen background — no wrapper needed here.
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
