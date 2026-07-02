import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router";

export function Login() {
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent, role: 'admin' | 'cliente') => {
    e.preventDefault();
    if (role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/cliente');
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center px-4 bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold tracking-tight">Acesse sua conta</CardTitle>
          <CardDescription>Para clientes e administradores</CardDescription>
        </CardHeader>
        
        <CardContent>
          <form className="flex flex-col gap-6">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email-address">Endereço de Email</FieldLabel>
                <Input 
                  id="email-address" 
                  name="email" 
                  type="email" 
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

            <div className="flex flex-col gap-3">
              <Button 
                size="lg"
                onClick={(e) => handleLogin(e, 'cliente')}
                className="w-full"
              >
                Entrar como Cliente
              </Button>
              <Button 
                size="lg"
                variant="secondary"
                onClick={(e) => handleLogin(e, 'admin')}
                className="w-full"
              >
                Entrar como Administrador
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
