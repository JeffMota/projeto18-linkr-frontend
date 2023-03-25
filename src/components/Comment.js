import React, { useContext, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Comment({ body }) {
  const { REACT_APP_API_URL } = process.env;
  const navigate = useNavigate();
  const { infosUser } = useContext(AuthContext);

  // async function like(postId) {
  //   setButtonDisabled(true);
  //   if (clickLike) {
  //     setClickLike(false);
  //   } else {
  //     setClickLike(true);
  //   }
  //   try {
  //     await axios.post(
  //       `${REACT_APP_API_URL}/likes`,
  //       { postId },
  //       {
  //         headers: { Authorization: `Bearer ${infosUser.token}` },
  //       }
  //     );
  //     setButtonDisabled(false);
  //   } catch (res) {
  //     setClickLike((current) => !current);
  //     setButtonDisabled(false);
  //   }
  //   return;
  // }

  return (
    <ContainerComment>
      <div>
        <img src={body.pictureUrl} alt="imageComment" />
      </div>
      <div>
        <div>
          <h1 onClick={() => navigate(`/user/${body.userId}`)}>
            {body.username} {body.follow && <span> • {body.follow}</span>}
          </h1>
        </div>
        <h2>{body.description}</h2>
      </div>
    </ContainerComment>
  );
}

const ContainerComment = styled.div`
  background-color: #1e1e1e;
  width: 100%;
  height: fit-content;
  border: none;
  padding: 15px;
  display: flex;
  font-family: "Lato", sans-serif;
  font-weight: 400;
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
    width: calc(100% - 40px - 10px);

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
