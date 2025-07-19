export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground mb-2">
          Authenticating your account...
        </p>
        <p className="text-sm text-muted-foreground/70">
          Please wait while we set up your session
        </p>
      </div>
    </div>
  );
}
