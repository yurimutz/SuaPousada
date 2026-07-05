export function Footer() {
  return (
    <footer className="w-full bg-muted/50 border-t border-border py-4 mt-auto">
      <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} SuaPousada. Todos os direitos reservados.
      </div>
    </footer>
  );
}
