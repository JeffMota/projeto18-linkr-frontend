import { createContext, useState } from "react";

export const SocketContext = createContext();

export default function AuthProvider({ children }) {
  const [socketChannel, setSocketChannel] = useState(false);

  return (
    <SocketContext.Provider value={{ socketChannel, setSocketChannel }}>
      {children}
    </SocketContext.Provider>
  );
}
