import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { X, Download, Trash2 } from "lucide-react";

interface ConsoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  microserviceName: string;
  microserviceStatus: string;
}

// Mock logs pour simuler la sortie console Spring Boot
const generateMockLogs = (serviceName: string, status: string) => {
  const baseTime = new Date();
  const logs = [];
  
  if (status === 'running' || status === 'building') {
    logs.push(
      `${baseTime.toISOString()} INFO --- [main] o.s.b.SpringApplication: Starting ${serviceName} using Java 17.0.2`,
      `${new Date(baseTime.getTime() + 100).toISOString()} INFO --- [main] o.s.b.SpringApplication: No active profile set, falling back to 1 default profile: "default"`,
      `${new Date(baseTime.getTime() + 200).toISOString()} INFO --- [main] o.s.d.r.c.RepositoryConfigurationDelegate: Bootstrapping Spring Data JPA repositories`,
      `${new Date(baseTime.getTime() + 300).toISOString()} INFO --- [main] o.s.d.r.c.RepositoryConfigurationDelegate: Finished Spring Data repository scanning`,
      `${new Date(baseTime.getTime() + 400).toISOString()} INFO --- [main] o.s.b.w.embedded.tomcat.TomcatWebServer: Tomcat initialized with port(s): 8080 (http)`,
      `${new Date(baseTime.getTime() + 500).toISOString()} INFO --- [main] o.apache.catalina.core.StandardService: Starting service [Tomcat]`,
      `${new Date(baseTime.getTime() + 600).toISOString()} INFO --- [main] org.apache.catalina.core.StandardEngine: Starting Servlet engine: [Apache Tomcat/10.1.13]`,
      `${new Date(baseTime.getTime() + 700).toISOString()} INFO --- [main] o.a.c.c.C.[Tomcat].[localhost].[/]: Initializing Spring embedded WebApplicationContext`,
      `${new Date(baseTime.getTime() + 800).toISOString()} INFO --- [main] w.s.c.ServletWebServerApplicationContext: Root WebApplicationContext: initialization completed`,
      `${new Date(baseTime.getTime() + 900).toISOString()} INFO --- [main] o.hibernate.jpa.internal.util.LogHelper: HHH000204: Processing PersistenceUnitInfo`,
      `${new Date(baseTime.getTime() + 1000).toISOString()} INFO --- [main] org.hibernate.Version: HHH000412: Hibernate ORM core version 6.2.7.Final`,
      `${new Date(baseTime.getTime() + 1100).toISOString()} INFO --- [main] com.zaxxer.hikari.HikariDataSource: HikariPool-1 - Starting...`,
      `${new Date(baseTime.getTime() + 1200).toISOString()} INFO --- [main] com.zaxxer.hikari.pool.HikariPool: HikariPool-1 - Added connection org.postgresql.jdbc.PgConnection@7e6cbb7a`,
      `${new Date(baseTime.getTime() + 1300).toISOString()} INFO --- [main] com.zaxxer.hikari.HikariDataSource: HikariPool-1 - Start completed.`,
      `${new Date(baseTime.getTime() + 1400).toISOString()} INFO --- [main] o.hibernate.engine.transaction.jta.platform.internal.JtaPlatformInitiator: HHH000490: Using JtaPlatform implementation: [org.hibernate.engine.transaction.jta.platform.internal.NoJtaPlatform]`,
      `${new Date(baseTime.getTime() + 1500).toISOString()} INFO --- [main] o.s.b.w.embedded.tomcat.TomcatWebServer: Tomcat started on port(s): 8080 (http) with context path ''`,
      `${new Date(baseTime.getTime() + 1600).toISOString()} INFO --- [main] o.s.b.SpringApplication: Started ${serviceName} in 2.847 seconds (process running for 3.234)`,
    );
    
    if (status === 'running') {
      logs.push(
        `${new Date(baseTime.getTime() + 2000).toISOString()} INFO --- [http-nio-8080-exec-1] o.a.c.c.C.[Tomcat].[localhost].[/]: Initializing Spring DispatcherServlet 'dispatcherServlet'`,
        `${new Date(baseTime.getTime() + 2100).toISOString()} INFO --- [http-nio-8080-exec-1] o.s.web.servlet.DispatcherServlet: Initializing Servlet 'dispatcherServlet'`,
        `${new Date(baseTime.getTime() + 2200).toISOString()} INFO --- [http-nio-8080-exec-1] o.s.web.servlet.DispatcherServlet: Completed initialization in 1 ms`
      );
    }
  } else if (status === 'stopped') {
    logs.push(
      `${baseTime.toISOString()} INFO --- [SpringApplicationShutdownHook] com.zaxxer.hikari.HikariDataSource: HikariPool-1 - Shutdown initiated...`,
      `${new Date(baseTime.getTime() + 100).toISOString()} INFO --- [SpringApplicationShutdownHook] com.zaxxer.hikari.HikariDataSource: HikariPool-1 - Shutdown completed.`,
      `${new Date(baseTime.getTime() + 200).toISOString()} INFO --- [SpringApplicationShutdownHook] o.s.b.SpringApplication: ${serviceName} stopped successfully`
    );
  }
  
  return logs;
};

export function ConsoleDialog({ open, onOpenChange, microserviceName, microserviceStatus }: ConsoleDialogProps) {
  const [logs, setLogs] = useState<string[]>([]);
  const [isAutoScroll, setIsAutoScroll] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      const mockLogs = generateMockLogs(microserviceName, microserviceStatus);
      setLogs(mockLogs);
      
      // Simulate real-time logs if running
      if (microserviceStatus === 'running') {
        const interval = setInterval(() => {
          const newLog = `${new Date().toISOString()} DEBUG --- [http-nio-8080-exec-${Math.floor(Math.random() * 10) + 1}] org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping: Mapped to [${microserviceName}Controller#healthCheck()]`;
          setLogs(prev => [...prev, newLog].slice(-100)); // Keep only last 100 logs
        }, 3000);
        
        return () => clearInterval(interval);
      }
    }
  }, [open, microserviceName, microserviceStatus]);

  useEffect(() => {
    if (isAutoScroll && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs, isAutoScroll]);

  const handleDownloadLogs = () => {
    const logContent = logs.join('\n');
    const blob = new Blob([logContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${microserviceName}-console.log`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClearLogs = () => {
    setLogs([]);
  };

  const getLogLevel = (log: string) => {
    if (log.includes('ERROR')) return { level: 'ERROR', className: 'text-red-400' };
    if (log.includes('WARN')) return { level: 'WARN', className: 'text-yellow-400' };
    if (log.includes('INFO')) return { level: 'INFO', className: 'text-blue-400' };
    if (log.includes('DEBUG')) return { level: 'DEBUG', className: 'text-green-400' };
    return { level: 'LOG', className: 'text-muted-foreground' };
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-6xl h-[85vh] sm:h-[80vh] flex flex-col" showCloseButton={false}>
        <DialogHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0 pb-4">
          <div className="flex items-center gap-3">
            <DialogTitle className="text-xl">Console - {microserviceName}</DialogTitle>
            <Badge variant={microserviceStatus === 'running' ? 'default' : 'secondary'}>
              {microserviceStatus === 'running' ? 'En cours' : 
               microserviceStatus === 'stopped' ? 'Arrêté' :
               microserviceStatus === 'building' ? 'Construction' : 'Téléchargement'}
            </Badge>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadLogs}
              className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
            >
              <Download className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Télécharger</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearLogs}
              className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
            >
              <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Vider</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="p-1 sm:p-2"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 mb-2">
            <span className="text-xs sm:text-sm text-muted-foreground">
              {logs.length} ligne{logs.length !== 1 ? 's' : ''}
            </span>
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 text-xs sm:text-sm">
                <input
                  type="checkbox"
                  checked={isAutoScroll}
                  onChange={(e) => setIsAutoScroll(e.target.checked)}
                  className="rounded"
                />
                Défilement automatique
              </label>
            </div>
          </div>

          <ScrollArea 
            ref={scrollRef}
            className="flex-1 rounded-md border bg-muted/10 p-2 sm:p-4 font-mono text-xs sm:text-sm w-full overflow-hidden"
          >
            <div className="space-y-1 w-full overflow-hidden">
              {logs.map((log, index) => {
                const { level, className } = getLogLevel(log);
                return (
                  <div key={index} className="flex gap-2 leading-relaxed w-full min-w-0">
                    <span className={`${className} font-semibold min-w-[40px] sm:min-w-[50px] flex-shrink-0`}>
                      {level}
                    </span>
                    <span className="text-foreground/90 break-words overflow-hidden flex-1 min-w-0">
                      {log}
                    </span>
                  </div>
                );
              })}
              {logs.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  Aucun log disponible
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}