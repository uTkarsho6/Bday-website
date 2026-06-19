import BirthdayExperience from "@/components/BirthdayExperience";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ name?: string; age?: string }>;
}) {
  const sp = await searchParams;
  const name = sp.name || "NAME";
  const age = parseInt(sp.age || "21", 10) || 21;

  return <BirthdayExperience recipientName={name} age={age} />;
}
