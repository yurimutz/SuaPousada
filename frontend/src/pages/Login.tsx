import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { useState } from "react";
import { Link } from "react-router";
import { toast } from "sonner";

export function Login() {
  const { login } = useAuth();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const response = await api.post("/auth/login", {
        email,
        password
      });
      
      const { token } = response.data;
      if (token) {
        toast.success("Login efetuado com sucesso!");
        login(token);
      }
    } catch (err: any) {
      setError("Credenciais inválidas. Verifique seu e-mail e senha.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-1 items-center justify-center px-4 w-full h-screen">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold tracking-tight">Acesse sua conta</CardTitle>
          <CardDescription>Para clientes e administradores</CardDescription>
        </CardHeader>
        
        <CardContent>
          <form className="flex flex-col gap-6" onSubmit={handleLogin}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email-address">E-mail</FieldLabel>
                <Input 
                  id="email-address" 
                  name="email" 
                  type="text" 
                  autoComplete="email" 
                  required 
                  placeholder="Digite seu email" 
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="password">Senha</FieldLabel>
                <Input 
                  id="password" 
                  name="password" 
                  type="password" 
                  autoComplete="current-password" 
                  required 
                  placeholder="Digite sua senha" 
                />
              </Field>
            </FieldGroup>

            {error && <p className="text-destructive text-sm text-center font-medium">{error}</p>}

            <div className="flex flex-col gap-3">
              <Button 
                size="lg"
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
            </div>
          </form>
        </CardContent>
        
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Ainda não tem conta? <Link to="/register" className="font-semibold leading-6 text-primary hover:text-primary/90">Cadastre-se</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
