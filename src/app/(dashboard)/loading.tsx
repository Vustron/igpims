import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <main className="m-auto flex size-full h-[100vh] flex-col items-center justify-center">
      <Loader2 className="size-20 animate-spin" />
    </main>
  )
}
