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
const IntentExplorePage = lazy(() => import("./app/premium/intentions/IntentExplorePage"));
const GlobalSearchPage = lazy(() => import("./app/features/search/GlobalSearchPage"));
const SportPage = lazy(() => import("./app/features/sport/SportPage"));
const LeaguePage = lazy(() => import("./app/features/league/LeaguePage"));
const FavoritesPage = lazy(() => import("./app/features/favorites/FavoritesPage"));
const PromotionsPage = lazy(() => import("./app/features/promotions/PromotionsPage"));
const WalletPage = lazy(() => import("./app/features/wallet/WalletPage"));
const DepositPage = lazy(() => import("./app/features/wallet/DepositPage"));
const WithdrawPage = lazy(() => import("./app/features/wallet/WithdrawPage"));
const NotificationsPage = lazy(() => import("./app/features/notifications/NotificationsPage"));
const PreferencesPage = lazy(() => import("./app/features/preferences/PreferencesPage"));
const HelpPage = lazy(() => import("./app/features/help/HelpPage"));
const MarketExplorerPage = lazy(() => import("./app/features/market/MarketExplorerPage"));
const LoginPage = lazy(() => import("./app/features/auth/LoginPage"));
const RegisterPage = lazy(() => import("./app/features/auth/RegisterPage"));
const OnboardingPage = lazy(() => import("./app/features/onboarding/OnboardingPage"));
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
              <Route path="/search" element={<GlobalSearchPage />} />
              <Route path="/sport/:sportId" element={<SportPage />} />
              <Route path="/league/:leagueId" element={<LeaguePage />} />
              <Route path="/event/:id" element={<EventPage />} />
              <Route path="/betslip" element={<BetslipPage />} />
              <Route path="/bets" element={<BetsPage />} />
              <Route path="/account" element={<AccountPage />} />
              <Route path="/account/preferences" element={<PreferencesPage />} />
              <Route path="/intencoes" element={<IntentExplorePage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
              <Route path="/promotions" element={<PromotionsPage />} />
              <Route path="/wallet" element={<WalletPage />} />
              <Route path="/wallet/deposit" element={<DepositPage />} />
              <Route path="/wallet/withdraw" element={<WithdrawPage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/help" element={<HelpPage />} />
              <Route path="/market-explorer" element={<MarketExplorerPage />} />
            </Route>
            <Route path="/auth/login" element={<LoginPage />} />
            <Route path="/auth/register" element={<RegisterPage />} />
            <Route path="/onboarding" element={<OnboardingPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
