'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Play, ArrowLeft, Volume2, VolumeX, Maximize2, RotateCcw } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function DemoVideoPage() {
  const router = useRouter()
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)
  const [videoError, setVideoError] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [showControls, setShowControls] = useState(true)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleLoadedMetadata = () => {
      setDuration(video.duration)
      setIsVideoLoaded(true)
    }

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime)
      setProgress((video.currentTime / video.duration) * 100)
    }

    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)
    const handleError = () => setVideoError(true)

    video.addEventListener('loadedmetadata', handleLoadedMetadata)
    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('play', handlePlay)
    video.addEventListener('pause', handlePause)
    video.addEventListener('error', handleError)

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('pause', handlePause)
      video.removeEventListener('error', handleError)
    }
  }, [])

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return

    if (video.paused) {
      video.play()
    } else {
      video.pause()
    }
  }

  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return

    video.muted = !video.muted
    setIsMuted(video.muted)
  }

  const toggleFullscreen = () => {
    const video = videoRef.current
    if (!video) return

    if (video.requestFullscreen) {
      video.requestFullscreen()
    }
  }

  const restartVideo = () => {
    const video = videoRef.current
    if (!video) return

    video.currentTime = 0
    video.play()
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const handleVideoClick = () => {
    togglePlay()
  }

  const handleMouseMove = () => {
    setShowControls(true)
    setTimeout(() => setShowControls(false), 3000)
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center">
                <Image
                  src="/henly_ai_logo.png"
                  alt="Henly AI"
                  width={200}
                  height={45}
                  className="h-8 w-auto"
                />
              </Link>
              <div className="hidden md:block">
                <span className="text-white text-sm font-medium">Demo Video</span>
              </div>
            </div>
            <Link
              href="/"
              className="flex items-center text-white hover:text-gray-300 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>

      {/* Video Container */}
      <div className="flex items-center justify-center min-h-screen pt-16">
        <div className="relative w-full max-w-6xl mx-auto">
          <div className="relative bg-black rounded-2xl overflow-hidden shadow-2xl">
            <div className="aspect-video relative">
              {/* Video */}
              {!videoError ? (
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover cursor-pointer"
                  muted={isMuted}
                  playsInline
                  preload="metadata"
                  onClick={handleVideoClick}
                  onMouseMove={handleMouseMove}
                >
                  <source src="/chatbot_demo_video.mov" type="video/quicktime" />
                  <source src="/chatbot_demo_video.mp4" type="video/mp4" />
                  <source src="/chatbot_demo_video.webm" type="video/webm" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-[rgba(89,95,57,0.2)] flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg" style={{ backgroundColor: '#595F39' }}>
                      <Play className="w-10 h-10 ml-1" fill="white" />
                    </div>
                    <p className="text-xl font-medium mb-3">Demo Video Unavailable</p>
                    <p className="text-gray-200 text-base mb-6">
                      The demo video could not be loaded. Please try again later.
                    </p>
                    <button 
                      onClick={() => {
                        setVideoError(false)
                        setIsVideoLoaded(false)
                      }}
                      className="px-8 py-3 rounded-xl text-white font-medium transition-colors hover:opacity-80"
                      style={{ backgroundColor: '#595F39' }}
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              )}

              {/* Loading Overlay */}
              {!isVideoLoaded && !videoError && (
                <div className="absolute inset-0 bg-black flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse" style={{ backgroundColor: '#595F39' }}>
                      <Play className="w-8 h-8 ml-1" fill="white" />
                    </div>
                    <p className="text-lg font-medium">Loading Demo Video...</p>
                  </div>
                </div>
              )}

              {/* Video Controls Overlay */}
              {isVideoLoaded && !videoError && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: showControls ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"
                >
                  {/* Top Controls */}
                  <div className="absolute top-4 right-4 flex space-x-2 pointer-events-auto">
                    <button
                      onClick={toggleMute}
                      className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                    >
                      {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                    </button>
                    <button
                      onClick={toggleFullscreen}
                      className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                    >
                      <Maximize2 className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Center Play Button */}
                  {!isPlaying && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
                      <button
                        onClick={togglePlay}
                        className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
                      >
                        <Play className="w-8 h-8 ml-1 text-white" fill="white" />
                      </button>
                    </div>
                  )}

                  {/* Bottom Controls */}
                  <div className="absolute bottom-4 left-4 right-4 pointer-events-auto">
                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="w-full h-1 bg-white/30 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-white transition-all duration-100"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Control Buttons */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={togglePlay}
                          className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                        >
                          {isPlaying ? (
                            <div className="w-5 h-5 flex items-center justify-center">
                              <div className="w-1 h-4 bg-white mr-1"></div>
                              <div className="w-1 h-4 bg-white"></div>
                            </div>
                          ) : (
                            <Play className="h-5 w-5 ml-0.5" fill="white" />
                          )}
                        </button>
                        <button
                          onClick={restartVideo}
                          className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                        >
                          <RotateCcw className="h-5 w-5" />
                        </button>
                        <span className="text-white text-sm font-mono">
                          {formatTime(currentTime)} / {formatTime(duration)}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Video Description */}
          <div className="mt-8 text-center">
            <h1 className="text-3xl font-bold text-white mb-4">Henly AI Demo</h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Watch how Henly AI transforms your business with intelligent chatbots and automation. 
              See real examples of AI-powered solutions in action.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
