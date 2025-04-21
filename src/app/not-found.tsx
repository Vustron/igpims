import Link from "next/link"

export default function NotFound() {
  return (
    <section className="flex min-h-[100vh] flex-col items-center justify-center">
      <h1 className="max-w-md scroll-m-20 text-center font-extrabold text-4xl tracking-tight lg:text-5xl">
        Can&apos;t seem to find this page. 🧐
      </h1>

      <Link href="/">
        <p className="mt-[50px] animate-pulse text-center font-md text-xl hover:text-slate-700">
          Go back
        </p>
      </Link>
    </section>
  )
}
