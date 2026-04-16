declare module "html2pdf.js" {
  type Html2PdfBuilder = {
    from: (source: HTMLElement | string) => Html2PdfBuilder;
    set: (options: Record<string, unknown>) => Html2PdfBuilder;
    save: () => Promise<void>;
  };

  const html2pdf: () => Html2PdfBuilder;
  export default html2pdf;
}

