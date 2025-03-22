import EnvForm from "./components/EnvForm";
import MigrationLogs from "./components/MigrationLogs";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./styles.css";

function App() {
    return (
        <div className="app">
            <h1>Jira to Azure Migration</h1>
            <EnvForm />
            <MigrationLogs />
            <ToastContainer />
        </div>
    );
}

export default App;
