import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function Sobre() {
  return (
    <div className="flex flex-col flex-1 items-center justify-start px-4 py-13">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-extrabold tracking-tight text-foreground sm:text-6xl mb-6">
          Sobre o Projeto <span className="text-primary">SuaPousada</span>
        </h1>
        <p className="mt-4 text-xl text-muted-foreground max-w-2xl mx-auto">
          Um Sistema de Gerenciamento de Pousadas desenvolvido como projeto acadêmico para o curso de Ciência da Computação na UFES.
        </p>
      </div>

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Nossa História Acadêmica</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              O <strong>SuaPousada.com</strong> foi concebido e desenvolvido no âmbito da disciplina de <strong>Projeto Integrado</strong> 
              do curso de <strong>Ciência da Computação</strong> da <strong>Universidade Federal do Espírito Santo (UFES)</strong>.
              Nosso objetivo foi projetar e implementar um sistema completo ponta-a-ponta capaz de gerenciar com eficiência as operações do dia-a-dia de uma pousada.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Autores</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Este sistema foi desenhado, estruturado e codificado pelos estudantes:
            </p>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2">
                <Badge variant="outline" className="text-sm px-3 py-1 bg-accent">Bruno Vale</Badge>
              </li>
              <li className="flex items-center space-x-2">
                <Badge variant="outline" className="text-sm px-3 py-1 bg-accent">Rafael Rodrigues</Badge>
              </li>
              <li className="flex items-center space-x-2">
                <Badge variant="outline" className="text-sm px-3 py-1 bg-accent">Yuri Mutz</Badge>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="w-full max-w-4xl mt-12">
        <h2 className="text-3xl font-bold mb-6 text-center">Tecnologias Utilizadas</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div className="p-6 bg-accent rounded-lg border">
            <h3 className="font-semibold text-lg mb-2 text-primary">Frontend</h3>
            <p className="text-sm text-muted-foreground">React, Tailwind CSS e Shadcn UI para uma interface dinâmica e moderna.</p>
          </div>
          <div className="p-6 bg-accent rounded-lg border">
            <h3 className="font-semibold text-lg mb-2 text-primary">Backend</h3>
            <p className="text-sm text-muted-foreground">Java com Spring Boot, Spring Web MVC e Spring Data JPA para a lógica de negócio.</p>
          </div>
          <div className="p-6 bg-accent rounded-lg border">
            <h3 className="font-semibold text-lg mb-2 text-primary">Infraestrutura</h3>
            <p className="text-sm text-muted-foreground">Banco de dados PostgreSQL, tudo orquestrado e containerizado via Docker.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
