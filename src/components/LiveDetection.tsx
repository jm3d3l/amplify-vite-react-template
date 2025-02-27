import { Loader, ThemeProvider } from "@aws-amplify/ui-react";
import { FaceLivenessDetector } from "@aws-amplify/ui-react-liveness";
import axios from "axios";
import React from "react";

export function LivenessQuickStartReact() {
    const [loading, setLoading] = React.useState<boolean>(true);
    const [createLivenessApiData, setCreateLivenessApiData] = React.useState<{
        sessionId: string;
    } | null>(null);

    // const APIURL = 'https://aws-face-liveness-api.onrender.com';
    const APIURL = "https://aws-face-recognation.vercel.app";
    // const APIURL = "http://localhost:3000";
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

    const ErrorNull = () => null;
    const handleAnalysisComplete = async () => {
        if (!createLivenessApiData?.sessionId) return;

        try {
            const { data } = await axios.get(
                `${APIURL}/get-liveness-session/${createLivenessApiData.sessionId}`
            );
            console.log("Liveness analysis result:", data);

            if (data.status === "FAILED") {
                window?.ReactNativeWebView?.postMessage("LIVENESS_FAIL");
                return;
            }

            if (data.confidence < 98) {
                window?.ReactNativeWebView?.postMessage("SPOOF_DETECTED");
                console.log("Spoof Detected");
                return;
            }

            window?.ReactNativeWebView?.postMessage(
                JSON.stringify({ status: "LIVENESS_SUCCESS", selfieName: data.selfieName })
            );
            console.log("User is live");
        } catch (error) {
            console.error("Error fetching liveness session results:", error);
            window?.ReactNativeWebView?.postMessage("LIVENESS_FAIL");
        } finally {
            setCreateLivenessApiData(null);
        }
    };
    return (
        <ThemeProvider>
            {loading ? (
                <Loader />
            ) : (
                <FaceLivenessDetector
                    sessionId={createLivenessApiData?.sessionId || ""}
                    region="ap-northeast-1"
                    onAnalysisComplete={handleAnalysisComplete}
                    onError={(error) => {
                        if (error.state === "TIMEOUT") {
                            window?.ReactNativeWebView?.postMessage("SCAN_TIMEOUT");
                        }
                    }}
                    components={{
                        ErrorView: ErrorNull,
                    }}
                />
            )}
        </ThemeProvider>
    );
}
