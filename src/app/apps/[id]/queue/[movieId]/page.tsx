'use client'

import {QueueEntry} from "@/common/api/Radarr/entities/QueueAPI"
import {useEffect, useState} from "react"

export default function QueueEntryPage({ params }: { params: { id: string, movieId: string } }) {
  const [record, setRecord] = useState<QueueEntry | null>(null)

  useEffect(() => {
    fetch(`/api/app/${params.id}/queue/${params.movieId}`)
  }, [params])

  if(!record) {
    return <div>Loading...</div>
  }
  return (
      <div>
          {JSON.stringify(params, null, 2)}
      </div>
  )
}