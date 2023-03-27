import React from "react";
import { useState, useContext } from "react";
import styled from "styled-components";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";
import { BsSend } from "react-icons/bs";

export default function AddComment({ pictureUrl, postId, setFormSubmitted }) {
  const [text, setText] = useState("");
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const { infosUser } = useContext(AuthContext);
  const { REACT_APP_API_URL } = process.env;
  async function submit(e) {
    e.preventDefault();
    setButtonDisabled(true);
    setFormSubmitted(true);
    try {
      const payload = {
        text,
        postId,
      };
      await axios.post(`${REACT_APP_API_URL}/comments`, payload, {
        headers: { Authorization: `Bearer ${infosUser.token}` },
      });
      setButtonDisabled(false);
      setFormSubmitted(false);
      setText("");
    } catch (res) {
      console.log(res.response.status);
      alert(
        "An error occured while trying to fetch the comments, please refresh the page"
      );
      setButtonDisabled(false);
      setFormSubmitted(false);
      setText("");
    }
    return;
  }
  return (
    <ContainerAddComment>
      <div>
        <img src={pictureUrl} alt="profilePicture" />
      </div>
      <form onSubmit={submit}>
        <input
          type={"text"}
          placeholder={"write a comment"}
          maxLength={144}
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={buttonDisabled}
          required></input>
        <button type={"submit"} disabled={buttonDisabled}>
          <BsSend />
          <h1>({144 - text.length})</h1>
        </button>
      </form>
    </ContainerAddComment>
  );
}

const ContainerAddComment = styled.div`
  background: #1e1e1e;
  width: 100%;
  border: none;
  margin-bottom: 20px;
  font-size: 20px;
  padding: 15px 15px 0 15px;
  display: flex;
  * {
    font-family: "Lato", sans-serif;
    font-weight: 400;
  }
  img {
    width: 40px;
    height: 40px;
    border-radius: 100%;
    object-fit: cover;
  }
  form {
    display: flex;
    position: relative;
    justify-content: space-between;
    align-items: flex-end;
    height: 100%;
    width: calc(100% - 40px);
    > :first-child {
      margin-left: 20px;
      height: 100%;
      width: 100%;
      background: #252525;
      border-radius: 8px;
      border: none;
      color: #acacac;
      padding: 0 40px 0 15px;
      ::placeholder {
        font-style: italic;
        font-size: 14px;
        color: #575757;
      }
    }
    > :last-child {
      position: absolute;
      background-color: #252525;
      border: none;
      color: #ffff;
      right: 15px;
      top: calc((40px - 25px) / 2);
      font-size: 15px;
      cursor: pointer;
      h1 {
        font-style: italic;
        font-size: 10px;
        color: #575757;
      }
    }
  }
`;
