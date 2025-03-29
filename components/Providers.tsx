import AuthProvider from "./AuthProvider";
import StoreProvider from "./StoreProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <StoreProvider>
                {children}
            </StoreProvider>
        </AuthProvider>
    );
}