// @refresh reload
import { mount, StartClient } from "@solidjs/start/client";
import { initWebSocket } from "~console";

mount(() => {
  initWebSocket();
  return <StartClient />;
}, document.getElementById("app")!);
