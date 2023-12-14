import styled from "styled-components";

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  
  width: 100%;
  max-height: 100%;

  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 5px;
  }

  &::-webkit-scrollbar-track {
    background: white;
  }

  &::-webkit-scrollbar-thumb {
    background: #8cd630;
  }
`;