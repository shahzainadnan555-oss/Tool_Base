import { Icon } from "@/components/ui/Icon";

const values = [
  {
    title: "100% Free",
    description: "Use Tool Base utilities without paid plans or hidden unlocks.",
    icon: "check",
  },
  {
    title: "No Sign-Up",
    description: "Open a tool and start working — no account creation required.",
    icon: "check",
  },
  {
    title: "Fast & Simple",
    description: "Find the utility you need quickly and complete the task with a clear flow.",
    icon: "check",
  },
  {
    title: "Straightforward Tools",
    description: "Clear uploads, results, and downloads — focused on finishing the task.",
    icon: "check",
  },
  {
    title: "Works on Desktop & Mobile",
    description: "Responsive layouts keep tools readable and usable across devices.",
    icon: "check",
  },
];

export function TrustStrip() {
  return (
    <section aria-label="Why people use Tool Base" className="border-b border-tm-border bg-tm-soft">
      <div className="tm-container grid gap-4 py-8 sm:grid-cols-2 lg:grid-cols-5">
        {values.map((value) => (
          <div key={value.title} className="rounded-2xl border border-tm-border bg-tm-white p-4">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-tm-info text-tm-accent">
              <Icon name={value.icon} className="h-4 w-4" />
            </span>
            <p className="mt-3 text-sm font-extrabold text-tm-text">{value.title}</p>
            <p className="mt-1 text-sm font-medium leading-relaxed text-tm-muted">
              {value.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
