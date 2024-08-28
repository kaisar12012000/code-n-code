export default function Home() {
  
  return (
    <>
    {/* <Navbar activeLink="" /> */}
    <main className="flex min-h-screen flex-col items-center justify-center align-center p-24">

      <h1 className="text-9xl font-mono">
        CodeNCode
      </h1>
      <div className="flex-col justify-between aligin-center px-10 py-2 my-10">
        <h2 className="text-2xl font-mono">
          Try out the online editor or create a room and code with others in real-time.
        </h2>
      </div>

      <div className="mb-32 flex text-center justify-center lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-4 lg:text-left">
        {/* <a
          href="/docs"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          rel="noopener noreferrer"
        >
          <h2 className="mb-3 text-2xl font-semibold">
            Docs{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            Find in-depth information about how the code editor works and how <em>Real time collaboration</em> is implememted.
          </p>
        </a> */}

        <a
          href="#"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          rel="noopener noreferrer"
        >
          <h2 className="mb-3 text-2xl font-semibold">
            View Code{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            Take a look at the code.
          </p>
        </a>
      </div>
    </main>
    </>
  );
}
