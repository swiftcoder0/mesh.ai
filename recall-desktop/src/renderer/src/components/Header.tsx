function Header(): React.JSX.Element {
  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "15px 20px",
        borderBottom: "1px solid #333",
      }}
    >
      <h1>📖 RecallPDF</h1>

      <button>📂 Open PDF</button>
    </header>
  );
}

export default Header;