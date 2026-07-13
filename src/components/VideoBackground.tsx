import { useEffect, useRef } from 'react'

const sources = [
  'https://cdn.pixabay.com/video/2019/10/09/27669-365224683_large.mp4',
  'https://cdn.pixabay.com/video/2020/08/30/48569-454825064_large.mp4',
]

export default function VideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    const play = async () => {
      try {
        await video.play()
      } catch {
        // autoplay blocked
      }
    }
    play()
  }, [])

  return (
    <div className="video-bg">
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1920' height='1080'%3E%3Crect fill='%230A0A0F' width='1920' height='1080'/%3E%3C/svg%3E"
      >
        {sources.map(src => (
          <source key={src} src={src} type="video/mp4" />
        ))}
      </video>
      <div className="video-bg-overlay" />
    </div>
  )
}
