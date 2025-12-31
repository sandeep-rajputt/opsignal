import GithubSvg from "@/svg/Github";

function GithubButton({ disable = false }: { disable?: boolean }) {
  return (
    <button
      disabled={disable}
      className="flex items-center cursor-pointer gap-5 px-5 py-3 rounded-md bg-secondary-background w-full"
    >
      <GithubSvg width={20} />
      <p>Continue with Github</p>
    </button>
  );
}

export default GithubButton;
