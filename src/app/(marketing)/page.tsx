import { Button } from "@/components/ui/button";
import {
  ClerkLoaded,
  ClerkLoading,
  SignedOut,
  SignedIn,
  SignUpButton,
  SignInButton,
} from "@clerk/nextjs";
import { Loader } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div
      className="mx-auto flex w-full max-w-[988px] flex-1 flex-col 
    items-center justify-center gap-2 p-4 lg:flex-row "
    >
                <div
            className="absolute mt-[200px] -ml-[1000px] h-[840px] w-[600px]
       "
          >
            <Image src="/hero-graphic.svg" alt="Hero" fill loading="eager" />
          </div>
   
      <div className="flex flex-col items-center gap-y-8">
    <div className="flex flex-col items-start gap-9 ml-[300px]">
    <h1 className=" text-center text-7xl font-bold text-white text-nowrap justify-center items-center">
          Flow into Fluency.
        </h1>
        <h1 className="max-w-[480px] text-left text-base font-regular tracking-wide text-white/60 lg:text-3xl">
          Learn, practice, and master new languages with Fluently.
        </h1>
        <div className="flex w-full max-w-[330px] flex-col items-center justify-center gap-y-3">
          <ClerkLoading>
            <Loader className="h-5 w-5 animate-spin text-muted-foreground" />
          </ClerkLoading>
          <ClerkLoaded>
            <SignedOut>
              <SignUpButton
                mode="modal"
                afterSignInUrl="/learn"
                afterSignUpUrl="/learn"
              >
                <Button size="lg" variant="secondary" className="w-full">
                  Get Started
                </Button>
              </SignUpButton>
              <SignInButton
                mode="modal"
                afterSignInUrl="/learn"
                afterSignUpUrl="/learn"
              >
                <Button size="lg" variant="primaryOutline" className="w-full">
                  I already have an account
                </Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <Button size="lg" variant="secondary" className="w-full" asChild>
                <Link href="/learn">Continue Learning</Link>
              </Button>
            </SignedIn>
          </ClerkLoaded>
        </div>
    </div>
     

      </div>
    </div>
  );
}
