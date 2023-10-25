import React from "react";

const IconAt: React.FC<{ style?: { width: string; height: string } }> = ({
  style = { width: "1rem", height: "1rem" },
}: {
  style?: { width: string; height: string };
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="tabler-icon tabler-icon-at"
      style={`width:${style.width}; height: ${style.height}`}
    >
      <path d="M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0"></path>
      <path d="M16 12v1.5a2.5 2.5 0 0 0 5 0v-1.5a9 9 0 1 0 -5.5 8.28"></path>
    </svg>
  );
};

export default IconAt;
