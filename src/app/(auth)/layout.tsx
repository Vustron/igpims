export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="h-screen w-full bg-center bg-cover">{children}</div>
}
