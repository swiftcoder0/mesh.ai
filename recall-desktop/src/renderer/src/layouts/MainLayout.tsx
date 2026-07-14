import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import PDFViewer from "../components/PDFViewer";
import RightPanel from "../components/RightPanel";
import StatusBar from "../components/StatusBar";

function MainLayout(): React.JSX.Element {
  return (
    <div>
      <Header />

      <main
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "20px",
          gap: "20px",
        }}
      >
        <Sidebar />

        <PDFViewer />

        <RightPanel />
      </main>

      <StatusBar />
    </div>
  );
}

export default MainLayout;