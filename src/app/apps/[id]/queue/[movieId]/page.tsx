'use client'

import {Movie} from "@/common/api/Radarr/entities/MovieAPI"
import MovieCard from "@/components/common/MovieCard"
import { use, useEffect, useState } from "react"

export default function QueueEntryPage(props: { params: Promise<{ id: string, movieId: string }> }) {
  const params = use(props.params)
  const [record, setRecord] = useState<Movie | null>(null)

  useEffect(() => {
    fetch(`/api/app/${params.id}/movie/${params.movieId}`) 
      .then(res => res.json()).then(setRecord)
  }, [params])

  if(!record) {
    return <div>Loading...</div>
  }
  return (
      <MovieCard movie={record} />
  )
}