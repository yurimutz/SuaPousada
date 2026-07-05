import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Construction } from "lucide-react";

interface ConstructionCardProps {
  description: string;
  content: string;
}

export function ConstructionCard({ description, content }: ConstructionCardProps) {
  return (
    <Card className="w-full max-w-2xl mx-auto mt-16 border-dashed border-2">
      <CardHeader className="text-center pb-2">
        <div className="mx-auto bg-muted p-4 rounded-full mb-4 w-fit">
          <Construction className="w-10 h-10 text-muted-foreground" />
        </div>
        <CardTitle className="text-2xl">Em Construção</CardTitle>
        <CardDescription className="text-lg">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center text-muted-foreground">
        {content}
      </CardContent>
    </Card>
  );
}
