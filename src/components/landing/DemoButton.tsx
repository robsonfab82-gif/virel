"use client";
import Link from "next/link";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useParams } from "next/navigation";

interface DemoButtonProps {
  label: string;
}

export function DemoButton({ label }: DemoButtonProps) {
  const params = useParams();
  const locale = (params?.locale as string) || "pt-BR";

  return (
    <Link href={`/${locale}/demo`}>
      <Button variant="secondary" size="xl" className="w-full sm:w-auto gap-2">
        <Play size={18} />
        {label}
      </Button>
    </Link>
  );
}
