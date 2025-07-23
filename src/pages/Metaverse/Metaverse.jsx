import { Canvas } from "@react-three/fiber";
import Avatar from "./Avatar/Avatar";
import Controls from "./Controls/Controls";
import Lights from "./Lights/Lights";
import {
  AdaptiveDpr,
  Bvh,
  KeyboardControls,
  PerformanceMonitor,
  Preload,
} from "@react-three/drei";
import useMovements from "../../utils/keys-movements";
import { Suspense, useEffect, useState, useCallback } from "react";
import { getUser } from "../../db/user-collection";
import { useLocation } from "react-router-dom";
import Menu from "./Menu/Menu";
import Users from "./Users/Users";
import { Physics } from "@react-three/rapier";
import Alu from "./Alu/Alu";
import Voice from "./Interaction/Voice/Voice";
import Messenger from "./Interaction/Messenger/Messenger";
import Instructive from "../../components/Instructive/Instructive";
import { useAuth } from "../../context/AuthContext";
import { useUser } from "../../context/UserContext";
import { socketServer } from "../../services/socket-server";
import useAvatarStore from "../../stores/avatar-store";
import { useAvatar } from "../../context/AvatarContext";
import EISC from "./EISC/EISC";
// import { Perf } from "r3f-perf";

/**
 * Metaverse Component
 * @returns {JSX.Element} Metaverse component
 */
export default function Metaverse() {
  const auth = useAuth();
  const { user, setUser } = useUser();
  const { avatar } = useAvatar();
  const { email } = auth.userLogged;
  const [isChatFocused, setIsChatFocused] = useState(false);
  const setAvatars = useAvatarStore((state) => state.setAvatars);
  const movements = useMovements(isChatFocused);
  const location = useLocation();
  const [, setDpr] = useState(1.5);
  const type = location.state;

  /**
   * Set guest user values
   * @param {string} type - User type
   */
  const setValuesGuest = useCallback(
    (type) => {
      const nickname = window.localStorage.getItem("nickname");
      const biography = window.localStorage.getItem("biography");
      const avatarUrl = window.localStorage.getItem("avatarUrl");
      const avatarPng = window.localStorage.getItem("avatarPng");
      const firstTime = window.localStorage.getItem("firstTime");

      setUser({
        nickname,
        biography,
        avatarUrl,
        avatarPng,
        firstTime,
        type,
      });
    },
    [setUser]
  );

  /**
   * Set user values
   * @param {string} email - User email
   * @param {string} type - User type
   */
  const setValuesUser = useCallback(
    async (email, type) => {
      const result = await getUser(email);
      if (result.success && result.data.length > 0) {
        setUser({
          ...result.data[0],
          type,
        });
      }
    },
    [setUser]
  );

  useEffect(() => {
    if (type === "user") {
      setValuesUser(email, type);
    } else if (type === "guest") {
      setValuesGuest(type);
    }
  }, [type, email, setValuesGuest, setValuesUser]);

  useEffect(() => {
    if (user?.nickname && user?.avatarUrl) {
      socketServer.emit("upgrade-avatar", {
        nickname: user.nickname,
        avatarUrl: user.avatarUrl,
      });
    }
  }, [user?.nickname, user?.avatarUrl]);

  useEffect(() => {
    const handleAvatars = (avatars) => {
      setAvatars(avatars);
    };

    socketServer.on("avatars", handleAvatars);

    return () => {
      socketServer.off("avatars", handleAvatars);
    };
  }, [setAvatars]);

  useEffect(() => {
    if (avatar.body) {
      avatar.body.setGravityScale(1, true);
    }
  }, [avatar.body]);

  return (
    user &&
    user?.avatarUrl && (
      <Suspense fallback={<Instructive isLoading />}>
        <Menu />
        <Messenger setIsChatFocused={setIsChatFocused} />
        <Voice />
        <KeyboardControls map={movements}>
          <Canvas shadows={false} camera={{ position: [0, 1.25, 0] }}>
            <PerformanceMonitor
              onIncline={() => setDpr(2)}
              onDecline={() => setDpr(1)}
            />
            <Bvh firstHitOnly>
              {/* <Perf position="top-left" />  */}
              <Lights />
              <Physics debug={false} timeStep={"vary"}>
                <EISC />
                <Alu position={[-1, 0, -1.5]} rotation-y={Math.PI * 0.15} />
                <Avatar />
                <Controls />
                <Users />
              </Physics>
              <Preload all />
              <AdaptiveDpr pixelated />
            </Bvh>
          </Canvas>
        </KeyboardControls>
      </Suspense>
    )
  );
}
