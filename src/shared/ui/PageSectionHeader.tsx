type PageHeaderProps = {
 title: string;
 description?: string;
};

export default function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <section className="w-full">
      <div className="inline-flex w-full max-w-[760px] flex-col gap-2">
        <h2 className="text-3xl font-black tracking-tight text-slate-900 md:text-[2.15rem]">
          {title}
        </h2>
        {description && (
          <p className="text-sm font-medium leading-relaxed text-slate-500 md:text-base">
            {description}
          </p>
        )}
      </div>
    </section>
  );
}
