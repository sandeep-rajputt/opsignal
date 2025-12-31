import GoogleSvg from "@/svg/Google";

function GoogleButton({ disable = false }: { disable?: boolean }) {
  return (
    <button
      disabled={disable}
      className="flex gap-5 items-center cursor-pointer px-5 py-3 rounded-md bg-secondary-background w-full"
    >
      <GoogleSvg width={20} />
      <p>Continue with Google</p>
    </button>
  );
}

export default GoogleButton;
