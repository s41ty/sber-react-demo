import { useEffect } from 'react';

export type KeyboardKey = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT' | 'OK';
export type KeyboardCallback = (key: KeyboardKey) => any;

export const useKeyboard = (onKeyboard: KeyboardCallback) => {
  useEffect(() => {
    const handleKeyboard = (event: KeyboardEvent): any => {
      switch( event.key ) {
        case "ArrowUp": // 38
          onKeyboard('UP');
          break;
        case "ArrowDown": // 40
          onKeyboard('DOWN');
          break;  
        case "ArrowLeft": // 37
          onKeyboard('LEFT');
          break;
        case "ArrowRight": // 39
          onKeyboard('RIGHT');
          break;
        case "Enter": //13
          onKeyboard('OK');
          break;  
        default: 
          break;
      }
    };
    window.addEventListener('keydown', handleKeyboard);
    return () => {
        window.removeEventListener('keydown', handleKeyboard);
    };
  }, [onKeyboard]);
}