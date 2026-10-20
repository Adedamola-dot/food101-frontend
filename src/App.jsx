import Logo from './components/Logo';

function App() {
  return (
    <div className="min-h-screen bg-brand-cream flex flex-col items-center justify-center">
      <Logo />
      <h1 className="text-3xl font-bold mt-8 text-text-dark">Food 101 is Building...</h1>
      <p className="text-text-muted mt-2">Tailwind is working perfectly.</p>
    </div>
  );
}

export default App;