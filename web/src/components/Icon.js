import React from 'react';
import { colors } from '../constants/colors';

// Componente de ícones SVG monocromáticos que correspondem aos ícones do Ionicons
const Icon = ({ name, size = 24, color = colors.white }) => {
  const iconSvgs = {
    // Ícones do Quiz
    'warning-outline': (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path d="M12 2L1 21h22L12 2zm0 3.99L19.53 19H4.47L12 5.99zM11 16h2v2h-2v-2zm0-6h2v4h-2v-4z" fill={color}/>
      </svg>
    ),
    'happy-outline': (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2"/>
        <path d="M8 14s1.5 2 4 2 4-2 4-2" stroke={color} strokeWidth="2" strokeLinecap="round"/>
        <circle cx="9" cy="9" r="1" fill={color}/>
        <circle cx="15" cy="9" r="1" fill={color}/>
      </svg>
    ),
    'color-palette-outline': (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path d="M12 2C6.49 2 2 6.49 2 12s4.49 10 10 10c1.38 0 2.5-1.12 2.5-2.5 0-.61-.23-1.15-.64-1.46-.42-.32-.86-.54-.86-1.04 0-1.38 1.12-2.5 2.5-2.5H17c2.76 0 5-2.24 5-5 0-5.51-4.49-10-10-10z" stroke={color} strokeWidth="2"/>
        <circle cx="6.5" cy="11.5" r="1.5" fill={color}/>
        <circle cx="9.5" cy="7.5" r="1.5" fill={color}/>
        <circle cx="14.5" cy="7.5" r="1.5" fill={color}/>
        <circle cx="17.5" cy="11.5" r="1.5" fill={color}/>
      </svg>
    ),
    'medical-outline': (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" stroke={color} strokeWidth="2"/>
        <path d="M12 8v8M8 12h8" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    'leaf-outline': (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.06.82C6.16 17.85 9.28 12.48 16 11c6.67-1.37 6-9 6-9s-1.54.23-5 2z" stroke={color} strokeWidth="2"/>
        <path d="M9.1 15a3.6 3.6 0 0 0 5.6-4.4" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    'construct-outline': (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.77 3.77z" stroke={color} strokeWidth="2"/>
      </svg>
    ),
    'balance-outline': (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path d="M12 3v18M8 21h8M5.5 7L10 21h4l4.5-14" stroke={color} strokeWidth="2" strokeLinecap="round"/>
        <circle cx="7" cy="7" r="2" stroke={color} strokeWidth="2"/>
        <circle cx="17" cy="7" r="2" stroke={color} strokeWidth="2"/>
      </svg>
    ),
    'ban-outline': (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2"/>
        <path d="M4.93 4.93l14.14 14.14" stroke={color} strokeWidth="2"/>
      </svg>
    ),
    'chatbubble-outline': (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke={color} strokeWidth="2"/>
      </svg>
    ),
    'shield-checkmark-outline': (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke={color} strokeWidth="2"/>
        <path d="M9 12l2 2 4-4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    
    // Ícones de navegação
    'arrow-back': (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path d="M19 12H5M12 19l-7-7 7-7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    'arrow-forward': (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path d="M5 12h14M12 5l7 7-7 7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    'settings-outline': (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="3" stroke={color} strokeWidth="2"/>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" stroke={color} strokeWidth="2"/>
      </svg>
    ),
    
    // Ícones de perfil
    'person-circle-outline': (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2"/>
        <circle cx="12" cy="8" r="3" stroke={color} strokeWidth="2"/>
        <path d="M6.168 18.849A4 4 0 0 1 10 16h4a4 4 0 0 1 3.834 2.855" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    'pencil': (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    'information-circle-outline': (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2"/>
        <path d="M12 16v-4M12 8h.01" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    
    // Ícones de ação
    'checkmark': (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path d="M20 6L9 17l-5-5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    'close': (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path d="M18 6L6 18M6 6l12 12" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    'checkmark-circle': (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" fill={color}/>
        <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    'close-circle': (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" fill={color}/>
        <path d="M15 9l-6 6M9 9l6 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    'star': (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill={color}/>
      </svg>
    ),
    'log-out-outline': (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <polyline points="16,17 21,12 16,7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <line x1="21" y1="12" x2="9" y2="12" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      width: '100%',
      height: '100%'
    }}>
      {iconSvgs[name] || (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2"/>
          <path d="M12 8v4M12 16h.01" stroke={color} strokeWidth="2" strokeLinecap="round"/>
        </svg>
      )}
    </div>
  );
};

export default Icon;