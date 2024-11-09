
import { Header } from "./_components/header";

type Props = {
  children: React.ReactNode;
};

const MarketingLayout = ({ children }: Props) => {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-tl from-[#0E373F] to-[#1A8983]">
      <Header />
      <main className="flex flex-1 flex-col items-center justify-center">
        {children}
      </main>
   
    </div>
  );
};

export default MarketingLayout;
