import { Suspense } from "react"
import PersonalClient from "../../../components/personal/PersonalClient"

export default function PersonalPage() {
  return (
    <Suspense>
      <PersonalClient />
    </Suspense>
  )
}