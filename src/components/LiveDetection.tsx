import { Loader, ThemeProvider } from '@aws-amplify/ui-react';
import { FaceLivenessDetector } from '@aws-amplify/ui-react-liveness';
import axios from 'axios';
import React from 'react';


export function LivenessQuickStartReact() {
  const [loading, setLoading] = React.useState<boolean>(true);
  const [createLivenessApiData, setCreateLivenessApiData] = React.useState<{
    sessionId: string;
  } | null>(null);

  // const APIURL = 'https://aws-face-liveness-api.onrender.com';
const APIURL = 'https://aws-face-recognation.vercel.app';
// const APIURL = 'http://localhost:3000';
  React.useEffect(() => {
    const fetchCreateLiveness: () => Promise<void> = async () => {
      /*
       * This should be replaced with a real call to your own backend API
       */
         const response = await axios.post(`${APIURL}/start-liveness`);
      const newSessionId = response.data.sessionId;
      const mockResponse = { sessionId: newSessionId };
      const data = mockResponse;

      setCreateLivenessApiData(data);
      setLoading(false);
    };

    fetchCreateLiveness();
  }, []);

  const handleAnalysisComplete: () => Promise<void> = async () => {
    /* . 
     * This should be replaced with a real call to your own backend API
     */
    const response = await axios.get(
      `${APIURL}/get-liveness-session/${createLivenessApiData?.sessionId}`
  );
  const confidence = response.data.confidence;
    
console.log('confidence.........', response)
setCreateLivenessApiData(null)
    if (confidence >= 98) {
      if (window?.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(
          JSON.stringify({
              status: "LIVENESS_SUCCESS",
              selfieName: response.data?.selfieName,
          })
      );
    }
    
      console.log('User is live');
    } else {
      if (window?.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage("LIVENESS_FAIL");
    }
      console.log('User is not live');
    }
  };

  return (
    <ThemeProvider>
      {loading ? (
        <Loader />
      ) : (
        <FaceLivenessDetector
          sessionId={createLivenessApiData?.sessionId || ''}
          region="ap-northeast-1"
          onAnalysisComplete={handleAnalysisComplete}
          onError={(error) => {
            console.error(error);
          }}
        />
      )}
    </ThemeProvider>
  );
}

