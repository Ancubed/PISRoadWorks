import Link from 'next/link';

export default function Home() {
  return (
    <main >
      <h1 >
        Welcome to <a href="https://nextjs.org">Next.js!</a>
      </h1>

      <div >
        <Link href='/try'>
          <a >
            <h2>Открыть страницу</h2>
          </a>
        </Link>
      </div>
    </main>
  )
}
