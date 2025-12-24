import { notFound } from "next/navigation";

import { QuestionarioWizard } from "@/components/marketing/questionario-wizard";

export default async function QuestionarioStepPage({
  params,
}: {
  params: Promise<{ step: string }>;
}) {
  const { step } = await params;
  const stepNumber = Number.parseInt(step.replace("step-", ""), 10);

  if (!stepNumber || stepNumber < 1 || stepNumber > 6) {
    notFound();
  }

  return <QuestionarioWizard step={stepNumber} />;
}
