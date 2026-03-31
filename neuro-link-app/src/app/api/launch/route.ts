import { NextResponse } from "next/server";
import { exec } from "child_process";

export async function GET() {
    try {
        const ST_APP_PATH = "c:\\Users\\ASUS\\OneDrive\\Desktop\\YogaAi\\Yoga_AI\\native-python-app";
        const cmd = `start cmd /k "cd /d ${ST_APP_PATH} && streamlit run brainwave_analyzer.py"`;

        exec(cmd, (error) => {
            if (error) {
                console.error(`exec error: ${error}`);
            }
        });

        return NextResponse.json({ status: "success", message: "Launching Streamlit..." });
    } catch (error: any) {
        return NextResponse.json({ status: "error", message: error.message }, { status: 500 });
    }
}
