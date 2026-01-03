import GithubSvg from "@/svg/Github";

function GithubButton({
  disable = false,
  handleClick = () => {},
}: {
  disable?: boolean;
  handleClick?: () => void;
}) {
  return (
    <button
      disabled={disable}
      onClick={handleClick}
      className={`flex items-center  gap-5 px-5 py-3 rounded-md bg-secondary-background w-full ${
        disable ? "cursor-not-allowed opacity-40" : "cursor-pointer opacity-100"
      }`}
    >
      <GithubSvg width={20} />
      <p>Continue with Github</p>
    </button>
  );
}

export default GithubButton;
