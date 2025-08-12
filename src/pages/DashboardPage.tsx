import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Code, Server, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const DashboardPage = () => {
  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">StartKit Manager</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Plateforme complète pour générer et gérer vos microservices Spring Boot
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <Card className="relative overflow-hidden border-2 hover:border-primary/50 transition-colors">
          <CardHeader className="space-y-4">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Code className="w-6 h-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl">Générateur de Code</CardTitle>
              <CardDescription className="text-base">
                Créez rapidement des microservices Spring Boot avec votre configuration personnalisée
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Configuration des agrégats et domaines</li>
              <li>• Choix des modules et dépendances</li>
              <li>• Configuration base de données</li>
              <li>• Génération automatique du code</li>
            </ul>
            <Button asChild className="w-full">
              <Link to="/generator" className="flex items-center gap-2">
                Accéder au Générateur
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-2 hover:border-primary/50 transition-colors">
          <CardHeader className="space-y-4">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Server className="w-6 h-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl">Manager de Services</CardTitle>
              <CardDescription className="text-base">
                Gérez le cycle de vie de vos microservices existants
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Liste et statut des microservices</li>
              <li>• Démarrage et arrêt des services</li>
              <li>• Configuration des environnements</li>
              <li>• Monitoring en temps réel</li>
            </ul>
            <Button asChild className="w-full">
              <Link to="/microservices" className="flex items-center gap-2">
                Accéder au Manager
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;