import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

export default function Comment({ body }) {
  const navigate = useNavigate();
  return (
    <>
      <ContainerComment>
        <div>
          <img src={body.pictureUrl} alt="imageComment" />
        </div>
        <div>
          <div>
            <h1 onClick={() => navigate(`/user/${body.userId}`)}>
              {body.username}{" "}
              {body.followStatus && <span>{body.followStatus}</span>}
            </h1>
          </div>
          <h2>{body.comment}</h2>
        </div>
      </ContainerComment>
      <Line></Line>
    </>
  );
}

const ContainerComment = styled.div`
  background-color: #1e1e1e;
  width: 100%;
  height: fit-content;
  padding: 15px;
  display: flex;
  * {
    font-family: "Lato", sans-serif;
    font-weight: 400;
  }
  a {
    text-decoration: none;
    h3 {
      color: #cecece;
    }
    h4 {
      color: #9b9595;
    }
  }
  > div:first-child {
    width: fit-content;
    display: flex;
    flex-direction: column;
    align-items: center;
    img {
      width: 40px;
      height: 40px;
      border-radius: 100%;
      object-fit: cover;
    }
  }
  > div:last-child {
    margin-left: 20px;
    width: calc(100% - 50px - 10px);
    word-break: break-all;
    > div {
      display: flex;
      justify-content: space-between;
      > div {
        display: flex;
        justify-content: space-between;
        width: 50px;
      }
    }
    h1 {
      color: #f3f3f3;
      font-size: 14px;
      margin-bottom: 3px;
    }
    h2 {
      color: #acacac;
      font-size: 14px;
    }
    span {
      color: #565656;
    }
  }
`;

const Line = styled.div`
  height: 1px;
  width: calc(100% - 30px);
  background-color: #353535;
`;
