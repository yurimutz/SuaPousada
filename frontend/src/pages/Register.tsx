import { HospedeForm } from "@/components/forms/hospede-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

import { useNavigate } from "react-router";

export function Register() {
    const navigate = useNavigate();
    const [error, setError] = useState("");

    return (
        <div className="flex flex-1 items-center justify-center px-4 w-full">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle className="text-3xl font-bold tracking-tight">Cadastre-se em nosso site!</CardTitle>
                </CardHeader>

                <CardContent>
                    <HospedeForm 
                        submitLabel="Cadastrar-se"
                        onSuccess={() => navigate("/login")} 
                    />
                </CardContent>

                {/* <CardFooter className="flex justify-center">
                    <p className="text-sm text-muted-foreground">
                        Ainda não tem conta? <Link to="/register" className="font-semibold leading-6 text-primary hover:text-primary/90">Cadastre-se</Link>
                    </p>
                </CardFooter> */}
            </Card>
        </div>
    );
}
