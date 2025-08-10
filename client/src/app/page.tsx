import Image from "next/image"; 

export default function Page() {
  return (
    <>
      <h1>Hello, Next.js!</h1>
      <Image src="/bot-img.png" width={100} height={100} alt={""} />
    </>
  );
}
