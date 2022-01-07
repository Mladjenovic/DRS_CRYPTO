import { BrowserRouter as Router, Route } from "react-router-dom";
import CustomLayout from "./containers/Layout";
import { DatePicker } from "antd";
import "antd/dist/antd.css"; // or 'antd/dist/antd.less'

function App() {
  return (
    <Router>
      <CustomLayout></CustomLayout>
    </Router>
  );
}

export default App;
