import { AuthProvider } from "./context/AuthContext";
import { UserProvider } from "./context/UserContext";
import { AvatarProvider } from "./context/AvatarContext";
import RoutesEISCMetaverse from "./routes/RoutesEISCMetaverse";

export default function Experience() {
  return (
    <AuthProvider>
      <UserProvider>
        <AvatarProvider>
          <RoutesEISCMetaverse />
        </AvatarProvider>
      </UserProvider>
    </AuthProvider>
  );
}

