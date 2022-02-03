import { useSession, getSession } from "next-auth/react";
import Error from '../../components/error';

export default function Page() {
  const { data: session } = useSession();
  if (session) {
    return (
      <main>
        <h1>Protected Page {session.user.name}</h1>
        <p>You can view this page because you are signed in.</p>
      </main>
    );
  }
  return <Error errStatusCode={403} errMessage='Нет доступа'/>;
}

export async function getServerSideProps(context) {
  return {
    props: {
      session: await getSession(context),
    },
  }
}