
import { Amplify } from 'aws-amplify';
import '@aws-amplify/ui-react/styles.css';
import { LivenessQuickStartReact } from "./components/LiveDetection";
import config from '../amplify_outputs.json'
Amplify.configure(config);

function App() {


  return (
  <LivenessQuickStartReact />
  );
}

export default App;
