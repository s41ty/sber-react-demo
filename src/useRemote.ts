import { useEffect } from 'react';

export type RemoteKey = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT' | 'OK';
export type RemoteCallback = (key: RemoteKey) => any;

export const useRemote = (onRemote: RemoteCallback) => {
  useEffect(() => {
    const handleKeyboard = (event: KeyboardEvent): any => {
      switch( event.key ) {
        case "ArrowUp": // 38
          onRemote('UP');
          break;
        case "ArrowDown": // 40
          onRemote('DOWN');
          break;  
        case "ArrowLeft": // 37
          onRemote('LEFT');
          break;
        case "ArrowRight": // 39
          onRemote('RIGHT');
          break;
        case "Enter": //13
          onRemote('OK');
          break;  
        default: 
          break;
      }
    };
    window.addEventListener('keydown', handleKeyboard);
    return () => {
        window.removeEventListener('keydown', handleKeyboard);
    };
  }, [onRemote]);
}