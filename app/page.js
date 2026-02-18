"use client";
import Hero from "./_Componants/Hero";
import Team from "./_Componants/Team";
import Corsus from "./_Componants/Corsus";
import What from "./_Componants/What";
import Footer from "./_Componants/Footer";
import { useAuth } from "./context/AuthContext";

export default function Home() {
  const { currentUser } = useAuth();

  return (
    <>
      <Hero />
      <Team />
      <Corsus limit={6} />
      <What isDetailsPage={false} />
      {!currentUser && (
        <div className="bg-white py-20 px-4 text-center border-t border-gray-100">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900">
              Unlock the Full Experience
            </h2>
            <p className="text-gray-500 text-lg">
              To browse our elite courses, meet our instructors, and access
              exclusive learning materials, please create an account or log in
              to your existing one.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <a
                href="/signup"
                className="px-8 py-4 bg-indigo-600 text-white rounded-full font-bold shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition w-full sm:w-auto"
              >
                Join Now
              </a>
              <a
                href="/login"
                className="px-8 py-4 bg-gray-100 text-gray-900 rounded-full font-bold hover:bg-gray-200 transition w-full sm:w-auto"
              >
                Existing Student
              </a>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
}
