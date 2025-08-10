import { getCurrentUser } from "@/lib/getCurrentUser"  

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    return <div className="text-center text-red-600">You must be logged in.</div>;
  }

  return (
    <div className="container py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Welcome, {user.name} 👋</h1>
        <p className="text-muted-foreground text-sm">Logged in as {user.email}</p>
      </div>

      {/* Your dashboard content */}
      <div className="bg-muted p-6 rounded-md">
        <p>This is your dashboard content.</p>
      </div>
    </div>
  )
}
