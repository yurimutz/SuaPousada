import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Item, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle } from "@/components/ui/item";

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

      <div className="w-full max-w-4xl mb-12">
        <Card className="text-center shadow-sm">
          <CardHeader>
            <CardTitle className="text-2xl">Nossa História Acadêmica</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              O <strong>SuaPousada.com</strong> foi concebido e desenvolvido no âmbito da disciplina de <strong>Projeto Integrado</strong> 
              do curso de <strong>Ciência da Computação</strong> da <strong>Universidade Federal do Espírito Santo (UFES)</strong>.
              Nosso objetivo foi projetar e implementar um sistema completo ponta-a-ponta capaz de gerenciar com eficiência as operações do dia-a-dia de uma pousada.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="w-full max-w-4xl mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Autores</h2>
        <ItemGroup className="flex-col sm:flex-row justify-center gap-6">
          <Item className="flex-1 max-w-xs mx-auto p-4 bg-card shadow-sm hover:shadow-md transition-shadow">
            <ItemMedia variant="image" className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-2 border-muted overflow-hidden shrink-0">
              <img src="/bruno.png" alt="Bruno Vale" />
            </ItemMedia>
            <ItemContent>
              <ItemTitle className="text-lg">Bruno Vale</ItemTitle>
              <ItemDescription>Desenvolvedor</ItemDescription>
            </ItemContent>
          </Item>
          
          <Item className="flex-1 max-w-xs mx-auto p-4 bg-card shadow-sm hover:shadow-md transition-shadow">
            <ItemMedia variant="image" className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-2 border-muted overflow-hidden shrink-0">
              <img src="/rafael.jpeg" alt="Rafael Rodrigues" />
            </ItemMedia>
            <ItemContent>
              <ItemTitle className="text-lg">Rafael Rodrigues</ItemTitle>
              <ItemDescription>Desenvolvedor</ItemDescription>
            </ItemContent>
          </Item>

          <Item className="flex-1 max-w-xs mx-auto p-4 bg-card shadow-sm hover:shadow-md transition-shadow">
            <ItemMedia variant="image" className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-2 border-muted overflow-hidden shrink-0">
              <img src="/yuri.png" alt="Yuri Mutz" />
            </ItemMedia>
            <ItemContent>
              <ItemTitle className="text-lg">Yuri Mutz</ItemTitle>
              <ItemDescription>Desenvolvedor</ItemDescription>
            </ItemContent>
          </Item>
        </ItemGroup>
      </div>

      <div className="w-full max-w-4xl mt-12">
        <h2 className="text-3xl font-bold mb-6 text-center">Tecnologias Utilizadas</h2>
        <ItemGroup className="flex-col sm:flex-row justify-center gap-6 text-center">
          <Item className="flex-1 p-6 bg-accent rounded-lg border flex-col items-center shadow-sm hover:shadow-md transition-shadow">
            <ItemContent className="items-center">
              <ItemTitle className="text-lg text-primary mb-2">Frontend</ItemTitle>
              <ItemDescription className="text-center">React, Tailwind CSS e Shadcn UI para uma interface dinâmica e moderna.</ItemDescription>
            </ItemContent>
          </Item>
          <Item className="flex-1 p-6 bg-accent rounded-lg border flex-col items-center shadow-sm hover:shadow-md transition-shadow">
            <ItemContent className="items-center">
              <ItemTitle className="text-lg text-primary mb-2">Backend</ItemTitle>
              <ItemDescription className="text-center">Java com Spring Boot, Spring Web MVC e Spring Data JPA para a lógica de negócio.</ItemDescription>
            </ItemContent>
          </Item>
          <Item className="flex-1 p-6 bg-accent rounded-lg border flex-col items-center shadow-sm hover:shadow-md transition-shadow">
            <ItemContent className="items-center">
              <ItemTitle className="text-lg text-primary mb-2">Infraestrutura</ItemTitle>
              <ItemDescription className="text-center">Banco de dados PostgreSQL, tudo orquestrado e containerizado via Docker.</ItemDescription>
            </ItemContent>
          </Item>
        </ItemGroup>
      </div>
    </div>
  );
}
