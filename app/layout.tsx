export const metadata = {
  title: "Worksmarto MCP",
  description: "Use Worksmarto's AI tools inside Claude, ChatGPT, Cursor and other AI apps.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#fffbea", color: "#1f1a10", fontFamily: "system-ui, -apple-system, Segoe UI, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
