// Root layout — minimal pass-through.
// The [locale] layout provides <html> and <body>.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
