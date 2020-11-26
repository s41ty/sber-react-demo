import React, { FC, memo, useRef, useEffect, useState } from "react";
import { createSmartappDebugger, createAssistant, AssistantAppState, AssistantCharacterType } from "@sberdevices/assistant-client";
import { darkJoy, darkEva, darkSber } from '@sberdevices/plasma-tokens/themes';
import { text, background, gradient, body1 } from '@sberdevices/plasma-tokens';
import { sberBox, sberPortal, touch } from '@sberdevices/plasma-tokens/typo';
import { Button } from '@sberdevices/ui/components/Button';
import { detectDevice } from '@sberdevices/ui/utils';
import styled, { createGlobalStyle } from 'styled-components';

import { MarketPage } from './MarketPage';

const ThemeBackgroundEva = createGlobalStyle(darkEva);
const ThemeBackgroundSber = createGlobalStyle(darkSber);
const ThemeBackgroundJoy = createGlobalStyle(darkJoy);
const TypoScaleSberBox = createGlobalStyle(sberBox);
const TypoScaleSberPortal = createGlobalStyle(sberPortal);
const TypoScaleTouch = createGlobalStyle(touch);

const AppStyle = styled.div`
    ${body1}
`;

const CommandButton = styled(Button)`
  margin: 0px;
  position: absolute;
  top: 20px;
  left: 20px;
`;

const CardButton = styled(Button)`
  margin: 0px;
  position: absolute;
  top: 20px;
  left: 180px;
`;

const Paragraph = styled.p`
  color: rgb(255, 255, 255, 0.5);
  font-size: 1em;
  margin:0;
  position: absolute;
  top: 20px;
  right: 20px;
  font-size: 18px;
  `;

const DocStyle = createGlobalStyle`
  html {
    color: ${text};
    background-color: ${background};
    background-image: ${gradient};
    min-height: 100vh;
  }
  `;

const initializeAssistant = (getState: any) => {
  if (process.env.NODE_ENV === "development") {
    return createSmartappDebugger({ 
      token: process.env.REACT_APP_SBER_TOKEN ?? "", 
      initPhrase: process.env.REACT_APP_SMARTAPP ?? "", 
      getState,
    });
  }
  return createAssistant({ getState });
};

export const App: FC = memo(() => {
  const [character, setCharacter] = useState("sber" as AssistantCharacterType);
  const [commands, setCommands] = useState(["Starting..."]);
  const [card, setCard] = useState(false);

  const assistantStateRef = useRef<AssistantAppState>();
  const assistantRef = useRef<ReturnType<typeof createAssistant>>();

  const sendCommand = (name: string, command: any) => {
    setCommands(prevState => {
      return [...prevState, `sending command "${name}" with params ${JSON.stringify(command)}`];
    });

    assistantRef.current?.sendData({ action: { action_id: name, parameters: command } });
  }

  const handleOnClick = () => {
    sendCommand("hello", { "text": "world"});
  };
  useEffect(() => {
    assistantRef.current = initializeAssistant(() => assistantStateRef.current);
    assistantRef.current.on("start", () => {
      setCommands(prevState => {
        return [...prevState, "Connected..."];
      });
    });
    assistantRef.current.on("data", (command) => {
      console.log(`command: ${JSON.stringify(command)}`);

      setCommands(prevState => {
        return [...prevState, JSON.stringify(command)];
      });

      switch (command.type) {
        case "character":
          setCharacter(command.character.id);
          // 'sber' | 'eva' | 'joy';
          break;
        case "navigation":
          break;
        case "smart_app_data":
          break;
        default:
          return;
      }
    });
  }, []);

  return (
    <AppStyle>
      {(() => {
        switch (detectDevice()) {
          case "sberBox":
            return <TypoScaleSberBox />
          case "sberPortal": 
            return <TypoScaleSberPortal />
          case "touch":
            return <TypoScaleTouch />
          default:
            return;
        }
      })()}
      {(() => {
        switch (character) {
          case "sber":
            return <ThemeBackgroundSber />;
          case "eva": 
            return <ThemeBackgroundEva />;
          case "joy":
            return <ThemeBackgroundJoy />;
          default:
            return;
        }
      })()}
      <DocStyle/>

      <Paragraph>1.0.0</Paragraph>
      <CommandButton view="primary" onClick={() => handleOnClick()}>send data</CommandButton>
      <CardButton view="primary" onClick={() => setCard(!card)}>{card ? "hide cards" : "show cards"}  </CardButton>

      <div className="container">
        {card &&
          <MarketPage />
        }
        {!card &&
          <ul className="command">
          {commands.map((command, index)  => (
            <li key={index}>{command}</li>
          ))}
        </ul>
        }
      </div>
    </AppStyle>
  );
});