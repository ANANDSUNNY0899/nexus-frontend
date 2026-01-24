import { Suspense } from "react"
import { LogsContent } from "@/components/logs/logs-content";


export default function LogsPage() {
  return (
    <Suspense fallback={null}>
      <LogsContent />
    </Suspense>
  )
}
