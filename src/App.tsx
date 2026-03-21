import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { lazy, Suspense } from "react";
import MainLayout from "./app/layouts/MainLayout";

const HomePage = lazy(() => import("./app/features/home/HomePage"));
const LivePage = lazy(() => import("./app/features/live/LivePage"));
const EventPage = lazy(() => import("./app/features/event/EventPage"));
const BetslipPage = lazy(() => import("./app/features/betslip/BetslipPage"));
const BetsPage = lazy(() => import("./app/features/bets/BetsPage"));
const ExplorePage = lazy(() => import("./app/features/explore/ExplorePage"));
const AccountPage = lazy(() => import("./app/features/account/AccountPage"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/live" element={<LivePage />} />
              <Route path="/explore" element={<ExplorePage />} />
              <Route path="/event/:id" element={<EventPage />} />
              <Route path="/betslip" element={<BetslipPage />} />
              <Route path="/bets" element={<BetsPage />} />
              <Route path="/account" element={<AccountPage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
