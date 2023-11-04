import { WebviewApi } from "vscode-webview";

const itemInStorage = localStorage.getItem("vertical-code-jumper.state");
let state: any = (itemInStorage && JSON.parse(itemInStorage)) || {
  music: initialMusicEnabled,
};

global.acquireVsCodeApi = <StateType = unknown>(): WebviewApi<StateType> => {
  return {
    setState: <T extends StateType | undefined>(newState: T): T => {
      state = newState;
      localStorage.setItem("vertical-code-jumper.state", JSON.stringify(state));

      return state;
    },
    getState: () => {
      return state;
    },
    postMessage(message: any) {
      if (message.type === "getWords") {
        window.postMessage({
          type: "addWords",
          words: webVersionWords,
        });
      }
    },
  };
};

const musicButton = document.getElementById("musicSwitcher");

if (musicButton) {
  musicButton.innerHTML = state.music ? "Music: ON" : "Music: OFF";

  musicButton.addEventListener("click", () => {
    const state = acquireVsCodeApi<{ music: boolean }>().getState();
    musicButton.innerHTML = !state?.music ? "Music: ON" : "Music: OFF";

    window.postMessage({
      type: "setMusicEnabled",
      enabled: !state?.music,
    });
  });
}

const restartButton = document.getElementById("restartButton");

if (restartButton) {
  restartButton.addEventListener("click", () => {
    window.postMessage({
      type: "restartGame",
    });
  });
}

global.webVersionWords = [
  "Algorithm",
  "Code",
  "Debug",
  "Function",
  "IDE (Integrated Development Environment)",
  "Loop",
  "Variable",
  "Object",
  "Class",
  "Database",
  "API (Application Programming Interface)",
  "Framework",
  "Git",
  "Repository",
  "Version control",
  "Bug",
  "Debugging",
  "Compiler",
  "Interpreter",
  "Agile",
  "Scrum",
  "Sprint",
  "User story",
  "Test",
  "Unit test",
  "Integration test",
  "Continuous integration",
  "DevOps",
  "Automation",
  "Code review",
  "Refactoring",
  "Dependency",
  "Module",
  "Library",
  "Framework",
  "HTTP",
  "HTTPS",
  "URL",
  "Web server",
  "API endpoint",
  "Front-end",
  "Back-end",
  "Full stack",
  "Design pattern",
  "OOP (Object-Oriented Programming)",
  "MVC (Model-View-Controller)",
  "REST",
  "SOAP",
  "JSON",
  "XML",
  "HTML",
  "CSS",
  "JavaScript",
  "Node.js",
  "React",
  "Angular",
  "Vue.js",
  "Docker",
  "Kubernetes",
  "Cloud",
  "AWS (Amazon Web Services)",
  "Azure",
  "GCP (Google Cloud Platform)",
  "Linux",
  "Windows",
  "Mac OS",
  "Virtualization",
  "Continuous delivery",
  "Testing framework",
  "API documentation",
  "Scrum Master",
  "Product Owner",
  "User interface",
  "User experience",
  "Deployment",
  "Deployment pipeline",
  "Microservices",
  "Serverless",
  "Scalability",
  "Security",
  "Encryption",
  "Authentication",
  "Authorization",
  "HTTP request",
  "HTTP response",
  "Framework",
  "CMS (Content Management System)",
  "Mobile app",
  "App store",
  "Codebase",
  "Sprint planning",
  "CI/CD pipeline",
  "Front-end framework",
  "Back-end framework",
  "Code quality",
  "Software architecture",
  "Tech stack",
  "API gateway",
  "Scalability",
  "Sprint retrospective",
];

const leftButton = document.getElementById("leftButton");

if (leftButton) {
  leftButton.addEventListener("mousedown", () => {
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft" }));
  });
  leftButton.addEventListener("mouseup", () => {
    window.dispatchEvent(new KeyboardEvent("keyup", { key: "ArrowLeft" }));
  });
}

const rightButton = document.getElementById("rightButton");

if (rightButton) {
  rightButton.addEventListener("mousedown", () => {
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight" }));
  });
  rightButton.addEventListener("mouseup", () => {
    window.dispatchEvent(new KeyboardEvent("keyup", { key: "ArrowRight" }));
  });
}
