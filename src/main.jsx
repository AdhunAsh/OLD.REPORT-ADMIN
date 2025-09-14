import { createRoot } from 'react-dom/client'
import './index.css'
import ReactDOM from "react-dom/client";
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { ClerkProvider, ClerkLoaded, ClerkLoading } from "@clerk/clerk-react";
import { LoadingProvider } from './contexts/LoadingContext';
import LoadingSpinner from './components/LoadingSpinner';

console.log("CLERK ENV KEY:", import.meta.env.VITE_CLERK_PUBLISHABLE_KEY);
const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
if (!clerkPubKey) {
  throw new Error("Missing Clerk publishable key");
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ClerkProvider publishableKey={clerkPubKey}>
    <ClerkLoading>
      <LoadingSpinner message="Initializing..." />
    </ClerkLoading>
    <ClerkLoaded>
      <BrowserRouter>
        <LoadingProvider>
          <App />
        </LoadingProvider>
      </BrowserRouter>
    </ClerkLoaded>
  </ClerkProvider>
);



