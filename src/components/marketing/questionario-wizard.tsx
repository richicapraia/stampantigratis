"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { quizDefaults, quizSchema, quizSteps, type QuizFormValues } from "@/components/marketing/quiz-schema";

const STORAGE_KEY = "stampantigratis_quiz";
const UTM_KEY = "stampantigratis_utm";

function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  const raw = window.localStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch (error) {
    return fallback;
  }
}

function writeStorage<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function QuestionarioWizard({ step }: { step: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const [submitting, setSubmitting] = useState(false);

  const storedDefaults = useMemo(() => readStorage(STORAGE_KEY, quizDefaults), []);

  const methods = useForm<QuizFormValues>({
    resolver: zodResolver(quizSchema),
    defaultValues: storedDefaults,
    mode: "onTouched",
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const utm = {
      utm_source: params.get("utm_source"),
      utm_medium: params.get("utm_medium"),
      utm_campaign: params.get("utm_campaign"),
      utm_content: params.get("utm_content"),
      utm_term: params.get("utm_term"),
      referrer: document.referrer || "",
    };
    writeStorage(UTM_KEY, utm);
  }, []);

  useEffect(() => {
    const subscription = methods.watch((value) => {
      writeStorage(STORAGE_KEY, value as QuizFormValues);
    });
    return () => subscription.unsubscribe();
  }, [methods]);

  const currentStep = quizSteps[step - 1];
  const progress = Math.round((step / quizSteps.length) * 100);

  async function handleNext() {
    const fields = currentStep.fields as Array<keyof QuizFormValues>;
    const valid = await methods.trigger(fields, { shouldFocus: true });
    if (!valid) return;

    if (step < quizSteps.length) {
      router.push(`/questionario/step-${step + 1}`);
    }
  }

  async function handlePrev() {
    if (step > 1) {
      router.push(`/questionario/step-${step - 1}`);
    }
  }

  async function handleSubmit(values: QuizFormValues) {
    setSubmitting(true);
    try {
      const utm = readStorage(UTM_KEY, {});
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          utm,
          path: pathname,
        }),
      });

      if (!response.ok) {
        throw new Error("Errore invio");
      }

      window.localStorage.removeItem(STORAGE_KEY);
      router.push("/thank-you");
    } catch (error) {
      setSubmitting(false);
      alert("Errore durante l'invio. Riprova o contattaci.");
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-6 py-10">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Step {step} di {quizSteps.length}</span>
          <span>{progress}% completato</span>
        </div>
        <div className="mt-2 h-2 w-full rounded-full bg-muted">
          <div className="h-2 rounded-full bg-foreground transition-all" style={{ width: `${progress}%` }} />
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-2xl">{currentStep.title}</CardTitle>
            <p className="text-sm text-muted-foreground">Compila i campi richiesti, ci aiutano a preparare la proposta migliore.</p>
          </CardHeader>
          <CardContent>
            <FormProvider {...methods}>
              <form
                className="grid gap-6"
                onSubmit={methods.handleSubmit(handleSubmit)}
              >
                {step === 1 && <StepOne />}
                {step === 2 && <StepTwo />}
                {step === 3 && <StepThree />}
                {step === 4 && <StepFour />}
                {step === 5 && <StepFive />}
                {step === 6 && <StepSix submitting={submitting} />}

                <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:justify-between">
                  <Button type="button" variant="outline" onClick={handlePrev} disabled={step === 1}>
                    Indietro
                  </Button>
                  {step < quizSteps.length ? (
                    <Button type="button" onClick={handleNext}>
                      Avanti
                    </Button>
                  ) : (
                    <Button type="submit" disabled={submitting}>
                      {submitting ? "Invio in corso..." : "Invia e ricevi la proposta"}
                    </Button>
                  )}
                </div>
              </form>
            </FormProvider>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function FieldError({ name }: { name: keyof QuizFormValues }) {
  const { formState } = useFormContextSafe();
  const error = formState.errors?.[name];
  if (!error) return null;
  return <p className="text-xs text-red-600">{error.message as string}</p>;
}


function StepOne() {
  const { register, setValue, watch } = useFormContextSafe();
  const sector = watch("sector");
  const locations = watch("locations");
  const peoplePrinting = watch("peoplePrinting");

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-2 sm:col-span-2">
        <Label>Ragione sociale</Label>
        <Input {...register("companyName")} placeholder="Studio Tecnico Rossi SRL" />
        <FieldError name="companyName" />
      </div>
      <div className="space-y-2">
        <Label>P.IVA / CF</Label>
        <Input {...register("vat")} placeholder="01234567890" />
        <FieldError name="vat" />
      </div>
      <div className="space-y-2">
        <Label>Settore</Label>
        <Select value={sector} onValueChange={(value) => setValue("sector", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Seleziona" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="studio-tecnico">Studio tecnico (architettura/ingegneria/CAD)</SelectItem>
            <SelectItem value="studio-professionale">Studio professionale (legale/commercialista)</SelectItem>
            <SelectItem value="pmi">PMI / Ufficio</SelectItem>
            <SelectItem value="agenzia">Agenzia / Servizi</SelectItem>
            <SelectItem value="altro">Altro</SelectItem>
          </SelectContent>
        </Select>
        <FieldError name="sector" />
      </div>
      <div className="space-y-2 sm:col-span-2">
        <Label>Indirizzo</Label>
        <Input {...register("address")} placeholder="Via Milano 10" />
        <FieldError name="address" />
      </div>
      <div className="space-y-2">
        <Label>Citta</Label>
        <Input {...register("city")} placeholder="Milano" />
        <FieldError name="city" />
      </div>
      <div className="space-y-2">
        <Label>Provincia</Label>
        <Input {...register("province")} placeholder="MI" />
        <FieldError name="province" />
      </div>
      <div className="space-y-2">
        <Label>CAP</Label>
        <Input {...register("postalCode")} placeholder="20100" />
        <FieldError name="postalCode" />
      </div>
      <div className="space-y-2">
        <Label>Numero sedi</Label>
        <Select value={locations} onValueChange={(value) => setValue("locations", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Seleziona" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1</SelectItem>
            <SelectItem value="2-3">2-3</SelectItem>
            <SelectItem value="4+">4+</SelectItem>
          </SelectContent>
        </Select>
        <FieldError name="locations" />
      </div>
      <div className="space-y-2">
        <Label>Persone che stampano</Label>
        <Select value={peoplePrinting} onValueChange={(value) => setValue("peoplePrinting", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Seleziona" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1</SelectItem>
            <SelectItem value="2-5">2-5</SelectItem>
            <SelectItem value="6-15">6-15</SelectItem>
            <SelectItem value="16+">16+</SelectItem>
          </SelectContent>
        </Select>
        <FieldError name="peoplePrinting" />
      </div>
    </div>
  );
}

function StepTwo() {
  const { setValue, watch } = useFormContextSafe();
  const formats = watch("formats");
  const monthlyVolume = watch("monthlyVolume");
  const colorMix = watch("colorMix");

  function toggleFormat(value: string) {
    if (formats?.includes(value)) {
      setValue("formats", formats.filter((item) => item !== value));
    } else {
      setValue("formats", [...(formats || []), value]);
    }
  }

  return (
    <div className="grid gap-6">
      <div className="space-y-2">
        <Label>Pagine totali al mese</Label>
        <Select value={monthlyVolume} onValueChange={(value) => setValue("monthlyVolume", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Seleziona" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="<500">&lt; 500</SelectItem>
            <SelectItem value="500-1000">500-1000</SelectItem>
            <SelectItem value="1000-2000">1000-2000</SelectItem>
            <SelectItem value="2000-4000">2000-4000</SelectItem>
            <SelectItem value="4000+">4000+</SelectItem>
          </SelectContent>
        </Select>
        <FieldError name="monthlyVolume" />
      </div>
      <div className="space-y-2">
        <Label>Percentuale colore vs bianco/nero</Label>
        <RadioGroup value={colorMix} onValueChange={(value) => setValue("colorMix", value)} className="grid gap-3">
          {[
            { value: "bn", label: "Prevalentemente BN" },
            { value: "misto", label: "Misto (BN + colore)" },
            { value: "colore", label: "Molto colore" },
          ].map((item) => (
            <label key={item.value} className="flex items-center gap-3 rounded-lg border border-border/60 p-3">
              <RadioGroupItem value={item.value} />
              <span>{item.label}</span>
            </label>
          ))}
        </RadioGroup>
        <FieldError name="colorMix" />
      </div>
      <div className="space-y-2">
        <Label>Formati usati</Label>
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { value: "a4", label: "A4" },
            { value: "a3", label: "A3" },
            { value: "plotter", label: "Grande formato" },
          ].map((item) => (
            <label key={item.value} className="flex items-center gap-3 rounded-lg border border-border/60 p-3">
              <Checkbox
                checked={formats?.includes(item.value)}
                onCheckedChange={() => toggleFormat(item.value)}
              />
              <span>{item.label}</span>
            </label>
          ))}
        </div>
        <FieldError name="formats" />
        <p className="text-xs text-muted-foreground">Se non lo sai con precisione, scegli la fascia piu vicina.</p>
      </div>
    </div>
  );
}

function StepThree() {
  const { setValue, watch } = useFormContextSafe();
  const printersNeeded = watch("printersNeeded");
  const distribution = watch("distribution");

  return (
    <div className="grid gap-6">
      <div className="space-y-2">
        <Label>Numero stampanti desiderate</Label>
        <Select value={printersNeeded} onValueChange={(value) => setValue("printersNeeded", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Seleziona" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1</SelectItem>
            <SelectItem value="2">2</SelectItem>
            <SelectItem value="3">3</SelectItem>
            <SelectItem value="4+">4+</SelectItem>
          </SelectContent>
        </Select>
        <FieldError name="printersNeeded" />
      </div>
      <div className="space-y-2">
        <Label>Distribuzione</Label>
        <RadioGroup value={distribution} onValueChange={(value) => setValue("distribution", value)} className="grid gap-3">
          {[
            { value: "centrale", label: "Un'unica postazione centrale" },
            { value: "multiple", label: "Piu postazioni (reception + uffici)" },
            { value: "sedi", label: "Piu sedi" },
          ].map((item) => (
            <label key={item.value} className="flex items-center gap-3 rounded-lg border border-border/60 p-3">
              <RadioGroupItem value={item.value} />
              <span>{item.label}</span>
            </label>
          ))}
        </RadioGroup>
        <FieldError name="distribution" />
      </div>
      <div className="space-y-2">
        <Label>Funzioni necessarie</Label>
        <CheckboxGroup
          name="functions"
          options={[
            { value: "stampa", label: "Stampa" },
            { value: "scansione", label: "Scansione" },
            { value: "copia", label: "Copia" },
            { value: "fax", label: "Fax" },
          ]}
        />
        <FieldError name="functions" />
      </div>
    </div>
  );
}

function StepFour() {
  return (
    <div className="grid gap-6">
      <div className="space-y-2">
        <Label>Priorita (max 2)</Label>
        <CheckboxGroup
          name="priorities"
          options={[
            { value: "qualita", label: "Qualita di stampa" },
            { value: "velocita", label: "Velocita" },
            { value: "costi", label: "Controllo costi" },
            { value: "affidabilita", label: "Affidabilita" },
            { value: "a3", label: "A3 / grandi formati" },
          ]}
        />
        <FieldError name="priorities" />
      </div>
      <div className="space-y-2">
        <Label>Tipi di documenti</Label>
        <CheckboxGroup
          name="documentTypes"
          options={[
            { value: "admin", label: "Documenti amministrativi" },
            { value: "marketing", label: "Presentazioni / marketing" },
            { value: "tecnici", label: "Documenti tecnici (CAD, tavole)" },
            { value: "etichette", label: "Etichette / altro" },
          ]}
        />
      </div>
    </div>
  );
}

function StepFive() {
  const { register, setValue, watch } = useFormContextSafe();
  const modelPreference = watch("modelPreference");

  return (
    <div className="grid gap-6">
      <div className="space-y-2">
        <Label>Preferenza modello</Label>
        <RadioGroup value={modelPreference} onValueChange={(value) => setValue("modelPreference", value)} className="grid gap-3">
          {[
            { value: "non-so", label: "Non so, sceglietelo voi" },
            { value: "a3", label: "Vorrei A3 (multifunzione)" },
            { value: "a4", label: "Vorrei A4 da scrivania" },
            { value: "plotter", label: "Mi serve anche un plotter" },
            { value: "altro", label: "Altro" },
          ].map((item) => (
            <label key={item.value} className="flex items-center gap-3 rounded-lg border border-border/60 p-3">
              <RadioGroupItem value={item.value} />
              <span>{item.label}</span>
            </label>
          ))}
        </RadioGroup>
        <FieldError name="modelPreference" />
      </div>
      <div className="space-y-2">
        <Label>Note aggiuntive</Label>
        <Textarea {...register("modelNote")} placeholder="Scrivi eventuali dettagli utili" />
      </div>
    </div>
  );
}

function StepSix({ submitting }: { submitting: boolean }) {
  const { register, setValue, watch } = useFormContextSafe();
  const contactPreference = watch("contactPreference");
  const consentPrivacy = watch("consentPrivacy");
  const consentMarketing = watch("consentMarketing");

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Nome e cognome</Label>
          <Input {...register("contactName")} placeholder="Mario Rossi" />
          <FieldError name="contactName" />
        </div>
        <div className="space-y-2">
          <Label>Ruolo</Label>
          <Input {...register("role")} placeholder="Titolare, Office Manager, IT" />
          <FieldError name="role" />
        </div>
        <div className="space-y-2">
          <Label>Email</Label>
          <Input {...register("email")} placeholder="mario@azienda.it" />
          <FieldError name="email" />
        </div>
        <div className="space-y-2">
          <Label>Telefono</Label>
          <Input {...register("phone")} placeholder="+39 333 1234567" />
          <FieldError name="phone" />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Preferenza contatto</Label>
        <RadioGroup value={contactPreference} onValueChange={(value) => setValue("contactPreference", value)} className="grid gap-3">
          {[
            { value: "email", label: "Email" },
            { value: "telefono", label: "WhatsApp/Telefono" },
          ].map((item) => (
            <label key={item.value} className="flex items-center gap-3 rounded-lg border border-border/60 p-3">
              <RadioGroupItem value={item.value} />
              <span>{item.label}</span>
            </label>
          ))}
        </RadioGroup>
        <FieldError name="contactPreference" />
      </div>
      <div className="space-y-2">
        <Label>Note</Label>
        <Textarea {...register("note")} placeholder="Info aggiuntive, dettagli, esigenze particolari" />
      </div>
      <div className="space-y-3">
        <label className="flex items-start gap-3 rounded-lg border border-border/60 p-3">
          <Checkbox checked={consentPrivacy} onCheckedChange={(value) => setValue("consentPrivacy", Boolean(value))} />
          <span className="text-sm">Ho letto e accetto la Privacy Policy</span>
        </label>
        <FieldError name="consentPrivacy" />
        <label className="flex items-start gap-3 rounded-lg border border-border/60 p-3">
          <Checkbox checked={consentMarketing} onCheckedChange={(value) => setValue("consentMarketing", Boolean(value))} />
          <span className="text-sm">Desidero ricevere aggiornamenti e offerte</span>
        </label>
      </div>
      <p className="text-xs text-muted-foreground">{submitting ? "Invio in corso, attendi..." : "Ti contattiamo solo con una proposta utile e trasparente."}</p>
    </div>
  );
}

function CheckboxGroup({
  name,
  options,
}: {
  name: keyof QuizFormValues;
  options: { value: string; label: string }[];
}) {
  const { setValue, watch } = useFormContextSafe();
  const values = (watch(name) as string[]) || [];

  function toggle(value: string) {
    if (values.includes(value)) {
      setValue(name, values.filter((item) => item !== value));
    } else {
      setValue(name, [...values, value]);
    }
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {options.map((item) => (
        <label key={item.value} className="flex items-center gap-3 rounded-lg border border-border/60 p-3">
          <Checkbox checked={values.includes(item.value)} onCheckedChange={() => toggle(item.value)} />
          <span>{item.label}</span>
        </label>
      ))}
    </div>
  );
}

function useFormContextSafe() {
  return useFormContext<QuizFormValues>();
}
