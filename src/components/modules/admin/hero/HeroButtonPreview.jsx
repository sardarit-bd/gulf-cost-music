"use client";

import { useEffect, useState } from "react";
import styled from "styled-components";

const HeroButtonPreview = ({ words = [], textColor = "#fff" }) => {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (!words.length) return;

        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % words.length);
        }, 1500);

        return () => clearInterval(interval);
    }, [words]);

    return (
        <StyledWrapper $textColor={textColor}>
            <button className="button">
                <span className="button_lg">
                    <span className="button_sl" />
                    <span key={words[index]} className="button_text word_rotate">
                        {words[index]}
                    </span>
                </span>
            </button>
        </StyledWrapper>
    );
};

const StyledWrapper = styled.div`
  .button {
    appearance: none;
    border: none;
    background: none;
    cursor: pointer;
    position: relative;
    padding: 8px;
    text-transform: uppercase;
    font-weight: bold;
    font-size: 14px;
  }

  .button::before,
  .button::after {
    content: '';
    display: block;
    position: absolute;
    right: 0;
    left: 0;
    height: calc(50% - 5px);
    border: 2px solid #d3d3d3;
    transition: all .15s ease;
  }

  .button::before {
    top: 0;
    border-bottom-width: 0;
  }

  .button::after {
    bottom: 0;
    border-top-width: 0;
  }

  .button_lg {
    position: relative;
    display: block;
    min-width: 170px;
    height: 44px;
    padding: 10px 20px;
    color: ${({ $textColor }) => $textColor};
    overflow: hidden;
  }

  .button_text {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .word_rotate {
    animation: wordRotate 0.45s ease;
  }

  @keyframes wordRotate {
    0% {
      opacity: 0;
      transform: translateY(18px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export default HeroButtonPreview;