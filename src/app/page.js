'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useAuthUser } from '@/firebase/firebaseFunctions';

export default function Home() {

  const user = useAuthUser();

  return (
    <div className="h-full bg-gray-900">
        <div className="text-center text-white mb-8">
          <h1 className="text-5xl font-bold sm:text-6xl md:text-7xl hover:drop-shadow-[0_0_20px_rgba(255,255,255,0.9)] transition-all duration-300 ease-in-out rounded-full">
            Welcome to the Note Distillery
          </h1>
        </div>
        <div className="flex flex-col md:flex-row items-center md:items-start">
          <div className="md:w-1/2 flex justify-center">
            <img
              src="/pexels-cristian-rojas-7260636.jpg"
              alt="Note Distillery"
              className="w-full h-auto rounded-lg max-w-md sm:w-auto"
            />
          </div>
          <div className="md:w-1/2 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-center md:text-center">
            <h2 className="text-4xl hover:drop-shadow-[0_0_20px_rgba(255,255,255,0.9)] transition-all duration-300 ease-in-out rounded-full">Maximize Your Learning</h2> {/* Increased font size */}
            <p className="mt-4 sm:text-align-center sm:mr-12 sm:ml-12 text-lg ">
              Note Distillery — your smart tool for turning handwritten or printed notes into clean, editable content. Just upload an image, and our AI extracts and organizes the text — even complex math. Study smarter with searchable, structured notes that help you stay focused and retain more.            
            </p>
          </div>
        </div>


        {/* Parallax Section */}
        <div
          className="relative bg-fixed bg-center bg-cover flex items-center justify-center mt-12 h-[115vh]
                    md:bg-[url('/pexels-vanessa-garcia-6326185.jpg')] bg-[url('/pexels-rdne-5759789.jpg')]"
        >
          <h2 className="flex justify-center items-center text-center text-4xl bg-gray-900/50 px-2 py-1 rounded-lg">
            Organize With Ease
          </h2>
        </div>
        <div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 text-center md:text-left" // Adjusted py-20 to py-10 to reduce spacing
        >
          <h2 className="text-4xl">Streamline Your Workflow</h2>
          <p className="mt-4 sm:text-align-center text-lg ">
            With Note Distillery, you can focus on what truly matters. Our intuitive platform ensures that your notes are always accessible, organized, and ready for action. Whether you're a student, professional, or lifelong learner, our tools are designed to help you achieve your goals effortlessly. Experience the future of note-taking today.
          </p>
        </div>

        {/* Login Section */}
        <Link href={user ? "/zone" : "/login"} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 text-center">
          <h2 className="text-3xl font-bold mb-6 hover:drop-shadow-[0_0_20px_rgba(255,255,255,0.9)] transition-all duration-300 ease-in-out rounded-full">Login to Enter <br/>"The Zone"</h2>
          <p className="mt-4" >
            Ready to transform your notes? Login now to begin your journey with Note Distillery.
          </p>
        </Link>
        {/* Contributors Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h2 className="text-3xl font-bold mb-6">Contributors</h2>
          <ul className="space-y-4">
            <li className="text-lg">Jonas Bronson</li>
            <li className="text-lg">Benton Diebold</li>
            <li className="text-lg">Jack Ryan</li>
            <li className="text-lg">Matt Wilson</li>
          </ul>
        </div>
      </div>
  );
}

