import { Icon } from "@iconify/react";

export default function TopBanner() {
  return (
    <div className="w-full bg-red-600 py-2.5 px-4 flex items-center justify-center gap-2">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
      </span>
      <p className="text-sm font-black text-white uppercase tracking-[0.2em]">
        Exclusivo para Médicos
      </p>
      <Icon icon="solar:verified-check-bold" className="text-white" width={16} />
    </div>
  );
}
