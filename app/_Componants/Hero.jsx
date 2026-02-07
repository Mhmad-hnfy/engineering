import React, { useState } from "react";
import Navbar from "./Navbar";
import HeroSlider from "./HeroSlider";
import { PlayCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AspectRatio } from "@/components/ui/aspect-ratio";

function Hero() {
  const [showVideoModal, setShowVideoModal] = useState(false);
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html:
            "\n    @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');\n\n    * {\n        font-family: 'Poppins', sans-serif;\n    }\n",
        }}
      />

      <section className="relative flex flex-col w-full bg-black">
        {/* Navigation - Overlay on Slider */}
        <Navbar />

        {/* Hero Slider Component */}
        <HeroSlider />

        {/* Showcase / Secondary Section */}
        <div className="relative z-10 -mt-20 px-4 pb-20 max-w-7xl mx-auto w-full">
          <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-2xl flex flex-col md:flex-row items-center gap-12 overflow-hidden relative">
            <div className="flex-1 space-y-6">
              <div className="inline-block px-4 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold tracking-wider uppercase">
                Innovation in Learning
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-gray-900 leading-[1.1]">
                Transforming Your Learning Experience
              </h2>
              <p className="text-gray-500 text-lg leading-relaxed">
                Our state-of-the-art platform combines interactive video content
                with advanced access control, giving you the best tools to
                master any subject.
              </p>
              <div className="flex gap-4 pt-4">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <img
                      key={i}
                      src={`https://i.pravatar.cc/100?img=${i + 10}`}
                      className="w-12 h-12 rounded-full border-4 border-white object-cover"
                      alt="User"
                    />
                  ))}
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-gray-900">
                    5,000+ Students
                  </span>
                  <span className="text-xs text-gray-400">
                    Trust us for their career growth
                  </span>
                </div>
              </div>
            </div>
            <div
              className="flex-1 w-full relative group cursor-pointer"
              onClick={() => setShowVideoModal(true)}
            >
              <img
                src="/Gemini_Generated_Image_k7mqtck7mqtck7mq.png"
                className="w-full rounded-3xl shadow-2xl transition duration-700 group-hover:scale-[1.02]"
                alt="showcase"
              />
              <div className="absolute inset-0 rounded-3xl ring-1 ring-black/10 flex items-center justify-center">
                <div className="w-16 h-16 bg-white/90 rounded-full backdrop-blur-md flex items-center justify-center shadow-xl animate-bounce group-hover:bg-white group-hover:scale-110 transition-all duration-300">
                  <PlayCircle className="text-indigo-600 w-8 h-8" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Video Modal */}
        <Dialog open={showVideoModal} onOpenChange={setShowVideoModal}>
          <DialogContent className="sm:max-w-4xl p-0 overflow-hidden bg-black border-gray-800 flex flex-col">
            <DialogHeader className="sr-only">
              <DialogTitle>Showcase Video</DialogTitle>
            </DialogHeader>
            <div className="relative group bg-black">
              <AspectRatio ratio={16 / 9} className="bg-black">
                <iframe
                  src={`https://www.youtube.com/embed/q3l9MdfqwDU?autoplay=1&modestbranding=1&rel=0`}
                  title="YouTube video player"
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </AspectRatio>
            </div>
          </DialogContent>
        </Dialog>
      </section>
    </>
  );
}

export default Hero;
