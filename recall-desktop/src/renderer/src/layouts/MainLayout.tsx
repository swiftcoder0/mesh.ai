import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import PDFViewer from "../components/PDFViewer";
import RightPanel from "../components/RightPanel";
import StatusBar from "../components/StatusBar";

function MainLayout(): React.JSX.Element {
  return (
    <div className="h-screen flex flex-col bg-slate-100">
      <Header />

      <main className="flex flex-1 overflow-hidden">
        <aside className="w-64 border-r bg-white p-4">
          <Sidebar />
        </aside>

        <section className="flex-1 bg-slate-50 p-6">
          <PDFViewer />
        </section>

        <aside className="w-80 border-l bg-white p-4">
          <RightPanel />
        </aside>
      </main>

      <footer className="border-t bg-white px-4 py-2">
        <StatusBar />
      </footer>
    </div>
  );
}

export default MainLayout;