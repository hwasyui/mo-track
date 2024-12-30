import React from "react";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

function Hero() {
  const { user } = useUser(); // Get user info from Clerk
  const router = useRouter(); // Next.js router for navigation

  const handleGetStartedClick = () => {
    if (user) {
      // If user is signed in, redirect to dashboard
      router.push("/dashboard");
    } else {
      // If user is not signed in, redirect to sign-in
      router.push("/sign-in");
    }
  };

  return (
    <section className="bg-gray-50 flex items-center flex-col">
      <div className="mx-auto max-w-screen-xl px-4 py-32 lg:flex">
        <div className="mx-auto max-w-xl text-center">
          <h1 className="text-3xl font-extrabold sm:text-5xl">
            Managing Your Money
            <strong className="font-extrabold text-primary sm:block">
              Control Your Future.
            </strong>
          </h1>

          <p className="mt-4 sm:text-xl/relaxed">
            With Mo-Track! Easy to use, learn, and imply!
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <button
              onClick={handleGetStartedClick} // Handle button click
              className="block w-full rounded bg-primary px-12 py-3 text-sm font-medium text-white shadow hover:bg-secondary focus:outline-none focus:ring active:bg-secondary sm:w-auto"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
      <Image
        src={"/dashboard.png"}
        alt="dashboard"
        width={1000}
        height={700}
        className="-mt-9 rounded-xl border-2"
      />
    </section>
  );
}

export default Hero;
