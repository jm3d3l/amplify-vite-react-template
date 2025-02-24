import React from 'react';
import { FaceLivenessDetector } from '@aws-amplify/ui-react-liveness';
import { Loader, ThemeProvider } from '@aws-amplify/ui-react';
import axios from 'axios';


export function LivenessQuickStartReact() {
  const [loading, setLoading] = React.useState<boolean>(true);
  const [createLivenessApiData, setCreateLivenessApiData] = React.useState<{
    sessionId: string;
  } | null>(null);

  React.useEffect(() => {
    const fetchCreateLiveness: () => Promise<void> = async () => {
      /*
       * This should be replaced with a real call to your own backend API
       */
         const response = await axios.post("https://aws-face-liveness-api.onrender.com/start-liveness");
      const newSessionId = response.data.sessionId;
      const mockResponse = { sessionId: newSessionId };
      const data = mockResponse;

      setCreateLivenessApiData(data);
      setLoading(false);
    };

    fetchCreateLiveness();
  }, []);

  const handleAnalysisComplete: () => Promise<void> = async () => {
    /*
     * This should be replaced with a real call to your own backend API
     */
    const response = await axios.get(
      `https://aws-face-liveness-api.onrender.com/get-liveness-session/${createLivenessApiData?.sessionId}`
  );
  const confidence = response.data.confidence;
    
console.log('confidence.........', response)
    if (confidence >= 85) {
      console.log('User is live');
    } else {
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

