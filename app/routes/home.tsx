import type { Route } from "./+types/home";
import { Welcome } from "../home/welcome";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "MerkaTrack" },
    { name: "description", content: "MerkaTrack" },
  ];
}

export default function Home() {
  return <Welcome />;
}
