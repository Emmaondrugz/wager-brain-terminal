import { useState } from "react";
import "../../../index.css";
import Toggle from "../../ui/toggle";
interface Provider {
  logo: string;
  name: string;
  url: string;
}
const PROVIDERS: Provider[] = [
  { logo: "/arbamigo.png", name: "Arb Amigo", url: "arbamigo.com" },
  { logo: "/breakingbet.png", name: "Breaking Bet", url: "breaking-bet.com" },
  { logo: "/betburger.png", name: "Betburger", url: "betburger.com" },
  { logo: "/oddsjam.png", name: "Odds Jam", url: "oddsjam.com" },
  { logo: "/surebet.png", name: "Sure Bet", url: "en.surebet.com" },
];
function ProviderBar({ provider }: { provider: Provider }) {
  return (
    <div className="w-full gap-3 h-fit items-center rounded-lg pb-2 flex justify-between">
      <div className="flex gap-2.5 items-center">
        <div className="h-fit flex shrink-0 items-center justify-center rounded-sm w-fit">
          <img
            src={provider.logo}
            alt={provider.name}
            className="w-6.5 object-contain rounded-[inherit]"
          />
        </div>
        <div className="flex flex-col items-start">
          <div className="text-[13px]">{provider.name}</div>
          <div className="text-[11px] text-gray-700 text-ellipsis whitespace-nowrap w-43 overflow-hidden">
            {provider.url}
          </div>
        </div>
      </div>
      <div>
        <Toggle checked={true} onChange={() => console.log("toggled!")} />
      </div>
    </div>
  );
}
export default function Widget() {
  const [providers] = useState<Provider[]>(PROVIDERS);
  return (
    <div className="flex flex-col bg-white gap-3 p-4">
      <div className="flex items-center justify-between">
        <div className="text-[15px]">Providers</div>
        <div className="p-2 border border-gray-200 border-b-2 rounded-full w-fit text-black">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="18px"
            viewBox="0 -960 960 960"
            width="18px"
            fill="#000"
          >
            <path d="M645.77-647.85 272.46-274.92q-8.31 8.3-20.88 8.11-12.58-.19-20.89-8.5-8.3-8.31-8.3-20.69t8.3-20.69L603.62-690H275.77q-12.75 0-21.38-8.63-8.62-8.63-8.62-21.38 0-12.76 8.62-21.37 8.63-8.62 21.38-8.62h393.84q15.37 0 25.76 10.39 10.4 10.4 10.4 25.76V-320q0 12.75-8.63 21.37-8.63 8.63-21.38 8.63-12.76 0-21.38-8.63-8.61-8.62-8.61-21.37v-327.85Z" />
          </svg>
        </div>
      </div>
      {providers.length > 0 ? (
        <div className="flex flex-col gap-3">
          {providers.map((provider, i) => (
            <div key={i}>
              <ProviderBar provider={provider} />
              {i !== providers.length - 1 && (
                <div className="h-[0.5px] w-full  bg-gray-200" />
              )}
            </div>
          ))}
        </div>
      ) : (
        <div>
          <div
            className="h-42 w-full bg-center bg-no-repeat bg-contain"
            style={{ backgroundImage: "url('/notifi.png')" }}
          />
          <div className="text-6xl">--</div>
        </div>
      )}
    </div>
  );
}
