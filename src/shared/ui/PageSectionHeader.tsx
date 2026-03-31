type PageHeaderProps = {
  title: string;
  description?: string;
};

export default function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <section>
      <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
      {description && <p className="text-slate-500">{description}</p>}
    </section>
  );
}
