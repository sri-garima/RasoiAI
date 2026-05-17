import { cn } from "@/lib/cn";

type SectionContainerProps = {
  children: React.ReactNode;
  className?: string;
  id?: string;
  as?: "section" | "div";
};

export function SectionContainer({
  children,
  className,
  id,
  as: Tag = "section",
}: SectionContainerProps) {
  return (
    <Tag
      id={id}
      className={cn("mx-auto w-full max-w-6xl px-5 sm:px-6 lg:px-8", className)}
    >
      {children}
    </Tag>
  );
}
