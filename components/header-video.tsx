import React from 'react'

function VideoSection() {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* ✅ Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      >
        <source src="/mainvideo.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* ✅ Centered text content */}
      <div className="flex flex-col items-center justify-center w-full h-screen text-center text-white bg-[#0000002f] relative z-10">
        <h1 className="text-4xl sm:text-4xl md:text-5xl lg:text-[3.5vw] font-bold mb-4 p-4">
          Strong Structures Stronger Trust
        </h1>
        <p className="text-base sm:text-lg lg:text-[18px] md:text-xl mb-6 text-gray-200">
          We build more than just buildings – we build trust. With strong design, quality material, and expert teams, <br/>We build lasting structures that shape homes, offices, Industries, Corporates and communities for generations to come.<br/>Your vision, our foundation
        </p>
        <button className="px-6 py-2 text-sm sm:text-base bg-green-600 hover:bg-green-700 rounded">
          Read More...
        </button>
      </div>


    </div>
  )
}

export default VideoSection;
