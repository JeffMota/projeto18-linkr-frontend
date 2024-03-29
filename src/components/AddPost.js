import React from "react";
import { useState, useContext } from "react";
import styled from "styled-components";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";

export default function AddPost({ pictureUrl, setFormSubmitted }) {
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [buttonValue, setButtonValue] = useState("Publish");
  const { infosUser } = useContext(AuthContext);
  const { REACT_APP_API_URL } = process.env;
  async function submit(e) {
    e.preventDefault();
    setButtonDisabled(true);
    setButtonValue("Publishing");
    setFormSubmitted(true);
    try {
      const payload =
        description !== ""
          ? {
              url,
              description,
            }
          : { url };
      await axios.post(`${REACT_APP_API_URL}/posts`, payload, {
        headers: { Authorization: `Bearer ${infosUser.token}` },
      });
      setButtonDisabled(false);
      setFormSubmitted(false);
      setUrl("");
      setDescription("");
      setButtonValue("Publish");
    } catch (res) {
      console.log(res.response.status);
      alert(
        "An error occured while trying to fetch the posts, please refresh the page"
      );
      setButtonDisabled(false);
      setFormSubmitted(false);
      setUrl("");
      setDescription("");
      setButtonValue("Publish");
    }

    return;
  }
  return (
    <ContainerAddPost data-test="publish-box">
      <div>
        <img src={pictureUrl} alt="profilePicture" />
      </div>
      <div>
        <h1>What are you going to share today?</h1>
        <form onSubmit={submit}>
          <input
            data-test="link"
            type={"text"}
            placeholder={"http://..."}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={buttonDisabled}
            required></input>
          <textarea
            data-test="description"
            type={"text"}
            maxLength={144}
            placeholder={"Awesome article about #javascript"}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={buttonDisabled}></textarea>
          <p>({144 - description.length})</p>
          <input
            data-test="publish-btn"
            type={"submit"}
            value={buttonValue}
            disabled={buttonDisabled}></input>
        </form>
      </div>
    </ContainerAddPost>
  );
}

const ContainerAddPost = styled.div`
  background: #ffffff;
  width: 100%;
  height: 200px;
  border-radius: 15px;
  border: none;
  margin-bottom: 20px;
  font-size: 20px;
  padding: 15px;
  display: flex;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 16px;
  * {
    font-family: "Lato", sans-serif;
    font-weight: 400;
  }
  img {
    width: 50px;
    height: 50px;
    border-radius: 100%;
    object-fit: cover;
  }
  div:first-child {
    width: fit-content;
  }
  div:last-child {
    margin-left: 10px;
    width: calc(100% - 40px - 10px);
    display: flex;
    flex-direction: column;
    height: 100%;
    h1 {
      font-size: 20px;
      font-weight: 300;
      margin-bottom: 10px;
    }
    h2 {
      font-size: 18px;
    }
  }
  div:last-child h1 {
    color: #707070;
  }
  form {
    display: flex;
    flex-direction: column;
    position: relative;
    justify-content: space-between;
    align-items: flex-end;
    height: 80%;
    > input,
    textarea {
      height: 30px;
      width: 100%;
      padding: 5px;
      border: none;
      border-radius: 5px;
      background-color: #efefef;
    }
    //Input de descrição
    > textarea {
      text-justify: start;
      height: 66px;
      resize: none;
    }
    //Botão de publicação
    > :last-child {
      width: 112px;
      background-color: #1877f2;
      color: #ffff;
    }
    p {
      position: absolute;
      bottom: 40px;
      right: 10px;
      font-size: 10px;
    }
  }
  @media only screen and (max-width: 600px) {
    width: 100%;
    border-radius: 0;
    div:first-child {
      display: none;
    }
    div:last-child {
      margin-left: 0;
      width: 100%;
      h1 {
        text-align: center;
      }
    }
  }
`;
