import GoogleSvg from "@/svg/Google";

function GoogleButton({
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
      className={`flex gap-5 items-center  px-5 py-3 rounded-md bg-secondary-background w-full ${
        disable ? "cursor-not-allowed opacity-40" : "cursor-pointer opacity-100"
      }`}
    >
      <GoogleSvg width={20} />
      <p>Continue with Google</p>
    </button>
  );
}

export default GoogleButton;
