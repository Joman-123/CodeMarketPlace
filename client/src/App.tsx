import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Explore from "@/pages/explore";
import Categories from "@/pages/categories";
import AssetDetails from "@/pages/asset-details";
import CreatorProfile from "@/pages/creator-profile";
import Login from "@/pages/login";
import Signup from "@/pages/signup";
import { AppLayout } from "@/components/AppLayout";
import { AuthProvider } from "@/lib/authContext";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/explore" component={Explore} />
      <Route path="/categories" component={Categories} />
      <Route path="/asset/:id" component={AssetDetails} />
      <Route path="/creator/:id" component={CreatorProfile} />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <AppLayout>
            <Router />
          </AppLayout>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
