import React from 'react';
import { keyframes } from '@emotion/react';
import { styled } from '@mui/material/styles';

const steamAnimation = keyframes`
  0% {
    transform: translateY(0) scale(1);
    opacity: 0;
  }
  50% {
    transform: translateY(-10px) scale(1.2);
    opacity: 0.6;
  }
  100% {
    transform: translateY(-20px) scale(1.4);
    opacity: 0;
  }
`;

const SteamPath = styled('path')`
  opacity: 0;
  transform-origin: center;
  .pan-icon:hover & {
    animation: ${steamAnimation} 2s ease-out infinite;
  }
  &:nth-of-type(2) {
    animation-delay: 0.3s;
  }
  &:nth-of-type(3) {
    animation-delay: 0.6s;
  }
`;

const PanIcon = styled('svg')`
  &:hover {
    cursor: pointer;
  }
`;

function CookingPanIcon({ size = 60, color = '#10B981' }) {
  return (
    <PanIcon
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="pan-icon"
    >
      {/* Steam */}
      <SteamPath
        d="M32 8C34 8 35 7 37 5"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <SteamPath
        d="M32 8C32 8 33 6 35 4"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <SteamPath
        d="M32 8C30 8 29 6 27 4"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      
      {/* Pan Handle */}
      <path
        d="M52 32H60"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
      />
      
      {/* Pan Body */}
      <path
        d="M8 32C8 20.9543 16.9543 12 28 12H36C47.0457 12 56 20.9543 56 32C56 43.0457 47.0457 52 36 52H28C16.9543 52 8 43.0457 8 32Z"
        fill={color}
      />
      
      {/* Pan Bottom Highlight */}
      <path
        d="M16 32C16 25.3726 21.3726 20 28 20H36C42.6274 20 48 25.3726 48 32C48 38.6274 42.6274 44 36 44H28C21.3726 44 16 38.6274 16 32Z"
        fill="#fff"
        fillOpacity="0.2"
      />
    </PanIcon>
  );
}

export default CookingPanIcon; 