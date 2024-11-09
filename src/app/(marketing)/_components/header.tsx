import { Button } from "@/components/ui/button";
import {
  ClerkLoaded,
  ClerkLoading,
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/nextjs";
import { Loader } from "lucide-react";
import Image from "next/image";

export const Header = () => {
  return (
    <header className="h-20 w-full border-b-1 border-slate-200 px-20 py-16 hover:bg-white/10">
      <div
        className="lg:max-w-screen-lg mx-auto flex items-center
       justify-between h-full "
      >
        <div className="pt-8 pl-4 pb-7 flex items-center gap-x-5 ">
          <Image src="/logo-icon.svg" alt="Logo" height={40} width={40} />
          <h1 className="text-4xl text-white tracking-wide font-bold mb-2">
            Fluently
          </h1>
        </div>
        <ClerkLoading>
          <Loader className="h-5 w-5 text-muted-foreground animate-spin" />
        </ClerkLoading>
        <ClerkLoaded>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          <SignedOut>
            <SignInButton
              mode="modal"
              afterSignInUrl="/learn"
              afterSignUpUrl="/learn"
            >
              <Button size="lg" variant="primary">
                Login
              </Button>
            </SignInButton>
          </SignedOut>
        </ClerkLoaded>
      </div>
    </header>
  );
};
