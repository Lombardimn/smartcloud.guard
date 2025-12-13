export default function Home() {
  return (
    <main className="flex flex-col min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
      <header className="flex flex-col items-start w-full max-w-4xl px-4 mb-8">
        <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-100">
          Guardia de Bugs
        </h1>
        <p className="text-zinc-700 dark:text-zinc-300">Aquí podrás verificar qué días te corresponden de guardia.</p>
      </header>

      <section className="max-w-4xl flex flex-col px-4">
        <div>componente 1</div>
        <div>componente 2</div>
        <div>componente 3</div>
      </section>
    </main>
  );
}
