import { useCallback, useState } from "react";

function useToggle(initilalValue = false) {
  const [value, setValue] = useState(initilalValue);

  const toggle = useCallback(() => {
    setValue((v) => !v);
  }, []);
  return [value, toggle];
}

export default useToggle;
