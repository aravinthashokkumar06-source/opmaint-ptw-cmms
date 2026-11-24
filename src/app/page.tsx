export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-8 bg-slate-900 text-white">
      <div className="max-w-md text-center space-y-4">
        <span className="text-xs uppercase tracking-widest font-bold text-orange-400 bg-orange-950/60 px-3 py-1 rounded-full border border-orange-500/30">
          Opmaint CMMS
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight">
          Permit to Work Module
        </h1>
        <p className="text-slate-400 text-sm">
          Project initialized. Ready for Step 2 (Database Schema & State Machine).
        </p>
      </div>
    </main>
  );
}
