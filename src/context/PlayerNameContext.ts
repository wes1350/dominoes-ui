import React from "react";

export const PlayerNameContext = React.createContext({
    name: null,
    setName: (name: string) => {}
});
