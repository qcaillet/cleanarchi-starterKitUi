import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import { TooltipProvider } from './components/ui/tooltip'
import { Toaster } from "@/components/ui/sonner"
import { SidebarProvider, SidebarTrigger } from './components/ui/sidebar'
import { AppSidebar } from './components/internal/AppSidebar'
import GeneratorPage from './pages/GeneratorPage'
import MicroservicesPage from './pages/MicroservicesPage'
import ConfigPage from './pages/ConfigPage'
import NotFound from './pages/NotFound'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();


function App() {
  return (
    <QueryClientProvider client={queryClient}>
    <TooltipProvider>
    <Toaster />
    <BrowserRouter>
        <SidebarProvider>
          <div className="flex min-h-screen w-full">
            <AppSidebar />
            <div className="flex-1 flex flex-col">
              <header className="h-12 flex items-center border-b bg-background">
                <SidebarTrigger className="ml-2" />
              </header>
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<GeneratorPage />} />
                  <Route path="/generator" element={<GeneratorPage />} />
                  <Route path="/microservices" element={<MicroservicesPage />} />
                  <Route path="/config" element={<ConfigPage />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </div>
          </div>
        </SidebarProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  )
}

export default App
