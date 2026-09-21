import { login } from './actions'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-4 p-6">
      <h1 className="text-2xl font-semibold">Sign in</h1>
      {error && (
        <p className="text-sm text-red-600">Invalid email or password.</p>
      )}
      <form className="flex flex-col gap-3">
        <label className="flex flex-col gap-1 text-sm">
          Email
          <input name="email" type="email" required className="border rounded px-3 py-2" />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Password
          <input name="password" type="password" required className="border rounded px-3 py-2" />
        </label>
        <button formAction={login} className="rounded bg-black px-4 py-2 text-white">
          Sign in
        </button>
      </form>
    </main>
  )
}
