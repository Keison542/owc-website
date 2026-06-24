import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import { PublicLayout } from "@/components/layout/PublicLayout";
import { StaffLayout } from "@/components/staff/StaffLayout";

import Home from "@/pages/home";
import About from "@/pages/about";
import Services from "@/pages/services";
import Forms from "@/pages/forms";
import News from "@/pages/news";
import NewsDetail from "@/pages/news-detail";
import Publications from "@/pages/publications";
import Legislation from "@/pages/legislation";
import Tenders from "@/pages/tenders";
import FAQs from "@/pages/faqs";
import Contact from "@/pages/contact";
import SearchPage from "@/pages/search";

import StaffLogin from "@/pages/staff/login";
import StaffDashboard from "@/pages/staff/dashboard";
import StaffNews from "@/pages/staff/news";
import StaffPublications from "@/pages/staff/publications";
import StaffForms from "@/pages/staff/forms";
import StaffLegislation from "@/pages/staff/legislation";
import StaffTenders from "@/pages/staff/tenders";
import StaffServices from "@/pages/staff/services";
import StaffFaqs from "@/pages/staff/faqs";
import StaffContact from "@/pages/staff/contact";
import StaffPending from "@/pages/staff/pending";
import StaffUsers from "@/pages/staff/users";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
});

function Router() {
  return (
    <Switch>
      {/* Public Pages */}
      <Route path="/">
        <PublicLayout><Home /></PublicLayout>
      </Route>
      <Route path="/about">
        <PublicLayout><About /></PublicLayout>
      </Route>
      <Route path="/services">
        <PublicLayout><Services /></PublicLayout>
      </Route>
      <Route path="/forms">
        <PublicLayout><Forms /></PublicLayout>
      </Route>
      <Route path="/news">
        <PublicLayout><News /></PublicLayout>
      </Route>
      <Route path="/news/:id">
        {(params) => <PublicLayout><NewsDetail id={params.id} /></PublicLayout>}
      </Route>
      <Route path="/publications">
        <PublicLayout><Publications /></PublicLayout>
      </Route>
      <Route path="/legislation">
        <PublicLayout><Legislation /></PublicLayout>
      </Route>
      <Route path="/tenders">
        <PublicLayout><Tenders /></PublicLayout>
      </Route>
      <Route path="/faqs">
        <PublicLayout><FAQs /></PublicLayout>
      </Route>
      <Route path="/contact">
        <PublicLayout><Contact /></PublicLayout>
      </Route>
      <Route path="/search">
        <PublicLayout><SearchPage /></PublicLayout>
      </Route>

      {/* Staff Portal */}
      <Route path="/staff/login">
        <StaffLogin />
      </Route>
      <Route path="/staff/dashboard">
        <StaffLayout><StaffDashboard /></StaffLayout>
      </Route>
      <Route path="/staff/news">
        <StaffLayout><StaffNews /></StaffLayout>
      </Route>
      <Route path="/staff/publications">
        <StaffLayout><StaffPublications /></StaffLayout>
      </Route>
      <Route path="/staff/forms">
        <StaffLayout><StaffForms /></StaffLayout>
      </Route>
      <Route path="/staff/legislation">
        <StaffLayout><StaffLegislation /></StaffLayout>
      </Route>
      <Route path="/staff/tenders">
        <StaffLayout><StaffTenders /></StaffLayout>
      </Route>
      <Route path="/staff/services">
        <StaffLayout><StaffServices /></StaffLayout>
      </Route>
      <Route path="/staff/faqs">
        <StaffLayout><StaffFaqs /></StaffLayout>
      </Route>
      <Route path="/staff/contact">
        <StaffLayout><StaffContact /></StaffLayout>
      </Route>
      <Route path="/staff/pending">
        <StaffLayout><StaffPending /></StaffLayout>
      </Route>
      <Route path="/staff/users">
        <StaffLayout><StaffUsers /></StaffLayout>
      </Route>
      <Route path="/staff">
        <StaffLogin />
      </Route>

      <Route>
        <PublicLayout><NotFound /></PublicLayout>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
