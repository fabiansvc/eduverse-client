import { useMemo } from "react";

// Movements object to map actions to key names
const MOVEMENTS = {
  forward: "forward",
  backward: "backward",
  leftward: "leftward",
  rightward: "rightward",
  exit: "exit",
};

/**
 * Custom hook to define keyboard movements based on chat focus
 * @param {boolean} isChatFocused - Indicates whether the chat is focused
 * @returns {Array} Array of movement mappings
 */
const useMovements = (isChatFocused) => {
  const map = useMemo(() => {
    if (!isChatFocused) {
      return [
        { name: MOVEMENTS.forward, keys: ["ArrowUp", "KeyW"] },
        { name: MOVEMENTS.backward, keys: ["ArrowDown", "KeyS"] },
        { name: MOVEMENTS.leftward, keys: ["ArrowLeft", "KeyA"] },
        { name: MOVEMENTS.rightward, keys: ["ArrowRight", "KeyD"] },
        { name: MOVEMENTS.exit, keys: ["Escape"] },
      ];
    } else {
      return [{ name: MOVEMENTS.exit, keys: ["Escape"] }];
    }
  }, [isChatFocused]);

  return map;
};

export default useMovements;
