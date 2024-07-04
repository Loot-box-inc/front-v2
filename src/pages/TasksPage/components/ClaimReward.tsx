import { Link } from "@/components/Link/Link";

export const ClaimReward = () => {
  return (
    <div className="flex flex-col justify-center items-center">
      <div className="pb-5">Task Completed Successfully!</div>
      <Link
        to="/claim"
        className="bg-blue rounded h-10 w-fit px-5 text-center flex items-center justify-center text-white"
      >
        Claim Here!
      </Link>
    </div>
  );
};
