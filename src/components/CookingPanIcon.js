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
  &:nth-of-type(4) {
    animation-delay: 0.9s;
  }
`;

const PanIcon = styled('svg')`
  transition: transform 0.3s ease;
  &:hover {
    transform: scale(1.05);
    cursor: pointer;
  }
`;

function CookingPanIcon({ size = 80, color = '#34495e' }) {
  return (
    <PanIcon 
      viewBox="0 0 400 400" 
      width={size} 
      height={size}
      xmlns="http://www.w3.org/2000/svg"
      className="pan-icon"
    >
      {/* Square Background */}
      <rect x="20" y="20" width="360" height="360" rx="20" ry="20" fill="#f8f4e9" />
      
      {/* Border - Kitchen Tile Pattern */}
      <rect x="20" y="20" width="360" height="360" rx="20" ry="20" fill="none" stroke={color} strokeWidth="10" />
      <rect x="20" y="20" width="360" height="360" rx="20" ry="20" fill="none" stroke="#7f8c8d" strokeWidth="2" strokeDasharray="30,30" strokeDashoffset="15" />
      
      {/* Pan Handle */}
      <path d="M250 230 L340 320" stroke={color} strokeWidth="24" strokeLinecap="round" />
      
      {/* Cooking Pan */}
      <ellipse cx="200" cy="220" rx="130" ry="45" fill={color} />
      <ellipse cx="200" cy="200" rx="130" ry="45" fill="#95a5a6" />
      <ellipse cx="200" cy="200" rx="110" ry="35" fill="#ecf0f1" />
      
      {/* Steam Swirls */}
      <SteamPath d="M150 160 C145 140, 165 130, 160 110" stroke="#7f8c8d" strokeWidth="5" strokeLinecap="round" fill="none" />
      <SteamPath d="M180 150 C175 130, 195 120, 190 100" stroke="#7f8c8d" strokeWidth="5" strokeLinecap="round" fill="none" />
      <SteamPath d="M210 145 C205 125, 225 115, 220 95" stroke="#7f8c8d" strokeWidth="5" strokeLinecap="round" fill="none" />
      <SteamPath d="M240 155 C235 135, 255 125, 250 105" stroke="#7f8c8d" strokeWidth="5" strokeLinecap="round" fill="none" />
      
      {/* Ingredients */}
      {/* Carrots */}
      <path d="M160 180 L175 210" stroke="#e67e22" strokeWidth="8" strokeLinecap="round" />
      <path d="M160 180 L155 165" stroke="#27ae60" strokeWidth="3" strokeLinecap="round" />
      <path d="M160 180 L165 165" stroke="#27ae60" strokeWidth="3" strokeLinecap="round" />
      <path d="M145 185 L160 215" stroke="#e67e22" strokeWidth="6" strokeLinecap="round" />
      <path d="M145 185 L140 170" stroke="#27ae60" strokeWidth="2" strokeLinecap="round" />
      
      {/* Tomatoes */}
      <circle cx="200" cy="190" r="15" fill="#c0392b" />
      <path d="M200 175 L205 165" stroke="#27ae60" strokeWidth="3" strokeLinecap="round" />
      <circle cx="170" cy="175" r="10" fill="#c0392b" />
      <path d="M170 165 L173 158" stroke="#27ae60" strokeWidth="2" strokeLinecap="round" />
      
      {/* Chicken Leg */}
      <path d="M240 195 C250 185, 260 195, 265 210" fill="#f5d6a6" stroke="#e8c994" strokeWidth="1" />
      <circle cx="265" cy="210" r="12" fill="#f5d6a6" stroke="#e8c994" strokeWidth="1" />
      
      {/* Eggs */}
      <circle cx="195" cy="215" r="10" fill="#fffaf0" stroke="#f0e6d2" strokeWidth="1" />
      <circle cx="195" cy="215" r="5" fill="#f39c12" />
      <circle cx="230" cy="175" r="8" fill="#fffaf0" stroke="#f0e6d2" strokeWidth="1" />
      
      {/* Mushrooms */}
      <path d="M220 210 C220 200, 240 200, 240 210" fill="#a3856c" stroke="#8d7761" strokeWidth="1" />
      <rect x="227" y="210" width="6" height="10" fill="#d9cfc1" rx="2" ry="2" />
      <path d="M205 195 C205 190, 215 190, 215 195" fill="#a3856c" stroke="#8d7761" strokeWidth="1" />
      <rect x="208" y="195" width="4" height="6" fill="#d9cfc1" rx="1" ry="1" />
      
      {/* Peas */}
      <circle cx="180" cy="195" r="4" fill="#27ae60" />
      <circle cx="190" cy="185" r="4" fill="#27ae60" />
      <circle cx="165" cy="200" r="4" fill="#27ae60" />
      <circle cx="175" cy="185" r="4" fill="#27ae60" />
      <circle cx="210" cy="205" r="4" fill="#27ae60" />
      
      {/* Water/Sauce Base */}
      <ellipse cx="200" cy="205" rx="105" ry="25" fill="#f39c12" opacity="0.3" />
      
      {/* Spoon */}
      <path d="M140 190 L130 180 L125 185 L130 195 Z" fill="#d35400" />
      <rect x="130" y="195" width="5" height="25" fill="#d35400" rx="2" ry="2" transform="rotate(30 130 195)" />
    </PanIcon>
  );
}

export default CookingPanIcon; 