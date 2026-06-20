import BirthdayExperience from "@/components/BirthdayExperience";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ name?: string; age?: string; id?: string }>;
}) {
  const sp = await searchParams;
  const name = sp.name || "MANASVI";
  const age = parseInt(sp.age || "20", 10) || 20;
  const configId = sp.id || "manasvi-20";

  return <BirthdayExperience initialName={name} initialAge={age} configId={configId} />;
}
