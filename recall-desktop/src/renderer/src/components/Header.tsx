function Header(): React.JSX.Element {
  const openPDF = async () => {
    const file = await window.api.openPDF();

    if (file) {
      console.log(file);
      alert(file);
    }
  };

  return (
    <header className="flex items-center justify-between border-b border-slate-700 bg-slate-900 px-6 py-4">
      <h1 className="text-2xl font-bold text-white">
        📖 RecallPDF
      </h1>

      <button
        onClick={openPDF}
        className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
      >
        📂 Open PDF
      </button>
    </header>
  );
}

export default Header;