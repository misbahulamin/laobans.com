import { UserProvider } from "../context/UserContext";
import { SwitchProvider } from "../context/SwitchContext";
import { DataProvider } from "../context/DataContext";
import { NotificationProvider } from "../context/NotificationContext";
import { Toaster } from "sonner";

export function AppProviders({ children }) {
  return (
    <UserProvider>
      <SwitchProvider>
        <DataProvider>
          <NotificationProvider>
            {children}
            <Toaster
              position="top-right"
              richColors
              closeButton
              theme="light"
              toastOptions={{
                style: {
                  fontFamily: "var(--font-sans)",
                },
              }}
            />
          </NotificationProvider>
        </DataProvider>
      </SwitchProvider>
    </UserProvider>
  );
}
