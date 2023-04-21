export default function SignIn() {
  const redirectToGithubSignIn = () => {
    const params = new URLSearchParams({
      client_id: "local",
      redirect_uri: "http://localhost:3000",
      response_type: "token",
      provider: "github",
    });
    location.href =
      import.meta.env.VITE_AUTH_URL + "/authorize?" + params.toString();
  };
  return (
    <main class="text-center mx-auto text-gray-700 p-4">
      <h1 class="max-6-xs text-6xl text-sky-700 font-thin uppercase my-16">
        Sign In
      </h1>
      <button
        onClick={redirectToGithubSignIn}
        class="bg-sky-600 text-white font-bold py-2 px-4 rounded"
      >
        Sign In
      </button>
      <p class="my-4"></p>
    </main>
  );
}
