import React, { useContext, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { AiFillDelete, AiOutlineHeart, AiFillEdit } from "react-icons/ai";
import { AiFillHeart } from "react-icons/ai";
import { ReactTagify } from "react-tagify";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Comment from "../components/Comment";

export default function Post({ body, liked }) {
  const [clickLike, setClickLike] = useState(!liked);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [textHovered, setTextHovered] = useState(body.likesUsernames);
  const [numLikes, setNumLikes] = useState(body.likes);
  const { REACT_APP_API_URL } = process.env;
  const navigate = useNavigate();
  const { infosUser } = useContext(AuthContext);
  ///

  const [comment, setComment] = useState([
    {
      pictureUrl:
        "https://sdinovacoesgraficas.com.br/wp-content/uploads/2020/07/the-flash_2023-Costurado-1I1-CAPA1.png",
      username: "Flash",
      description: "Também achei",
      follow: "post's author",
    },
    {
      pictureUrl:
        "https://sdinovacoesgraficas.com.br/wp-content/uploads/2020/07/the-flash_2023-Costurado-1I1-CAPA1.png",
      username: "Flash",
      description: "Também achei",
      follow: "following",
    },
    {
      pictureUrl:
        "https://sdinovacoesgraficas.com.br/wp-content/uploads/2020/07/the-flash_2023-Costurado-1I1-CAPA1.png",
      username: "Flash",
      description: "Também achei",
      follow: "",
    },
  ]);

  ///

  async function like(postId) {
    setButtonDisabled(true);
    if (clickLike) {
      setClickLike(false);
      setNumLikes(Number(numLikes) + 1);
    } else {
      setClickLike(true);
      setNumLikes(Number(numLikes) - 1);
    }
    try {
      await axios.post(
        `${REACT_APP_API_URL}/likes`,
        { postId },
        {
          headers: { Authorization: `Bearer ${infosUser.token}` },
        }
      );
      setButtonDisabled(false);
    } catch (res) {
      setClickLike((current) => !current);
      setButtonDisabled(false);
    }
    return;
  }

  async function deletePost(postId) {
    setButtonDisabled(true);
    try {
      await axios.delete(`${REACT_APP_API_URL}/posts/${postId}`, {
        headers: { Authorization: `Bearer ${infosUser.token}` },
      });
      setButtonDisabled(false);
    } catch (res) {
      console.log(res.response.status);
      setButtonDisabled(false);
    }
    return;
  }

  async function updatePost(postId) {
    setButtonDisabled(true);
    try {
      await axios.put(
        `${REACT_APP_API_URL}/posts/${postId}`,
        { description: "teste" },
        {
          headers: { Authorization: `Bearer ${infosUser.token}` },
        }
      );
      setButtonDisabled(false);
    } catch (res) {
      console.log(res.response.status);
      setButtonDisabled(false);
    }
    return;
  }

  const handleMouseEnter = () => {
    setIsHovered(true);
  };
  const handleMouseLeave = () => {
    setIsHovered(false);
  };
  async function handleTag(tag) {
    const normalizedTag = tag.match(/[\wñÑáéíóúÁÉÍÓÚãÃõÕâÂêÊôÔ]+/g)[0];
    const cleanTag = tag.match(/#[\wñÑáéíóúÁÉÍÓÚãÃõÕâÂêÊôÔ]+/g)[0];
    // const updateClicks = await axios.post()
    navigate(`/hashtag/${normalizedTag}`, { cleanTag: cleanTag });
  }
  return (
    <>
      <ContainerPost data-test="post">
        <div>
          <img src={body.pictureUrl} alt="imagePost" />
          <ContainerLike
            data-test="like-btn"
            clicked={clickLike}
            onClick={() => {
              like(body.id);
            }}
            disabled={buttonDisabled}>
            {clickLike ? <AiOutlineHeart /> : <AiFillHeart />}
          </ContainerLike>
          <ContainerNumberLikes
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}>
            <h4 data-test="counter">{numLikes} likes</h4>
            {isHovered && <div>{textHovered}</div>}
          </ContainerNumberLikes>
        </div>
        <div>
          <div>
            <h1 onClick={() => navigate(`/user/${body.userId}`)}>
              {body.username}
            </h1>
            {body.userId === Number(localStorage.getItem("userId")) && (
              <div>
                <AiFillEdit onClick={() => updatePost(body.id)} />
                <AiFillDelete onClick={() => deletePost(body.id)} />
              </div>
            )}
          </div>
          {body.description ? (
            <ReactTagify colors="white" tagClicked={(tag) => handleTag(tag)}>
              <h2 data-test="description">{body.description}</h2>
            </ReactTagify>
          ) : (
            <h2>{body.description}</h2>
          )}
          <a
            ata-test="link"
            href={body.url}
            target="_blank"
            rel="noopener noreferrer">
            <section>
              <div>
                <h3>{body.urlTitle}</h3>
                <h4>{body.urlDescription}</h4>
                <h4>{body.url}</h4>
              </div>
              <div>
                <img src={body.urlImage} alt="imagePost" />
              </div>
            </section>
          </a>
        </div>
      </ContainerPost>
      {comment.length !== 0 && (
        <ContainerComments>
          {comment.map((p) => (
            <>
              <Comment key={p.id} body={p} />
              <hr></hr>
            </>
          ))}
        </ContainerComments>
      )}
    </>
  );
}

const ContainerPost = styled.div`
  background-color: #171717;
  color: #b7b7b7;
  width: 100%;
  height: fit-content;
  border-radius: 15px;
  border: none;
  margin-top: 20px;
  font-size: 20px;
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
      width: 50px;
      height: 50px;
      border-radius: 100%;
      margin-bottom: 15px;
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
      color: #ffffff;
      font-size: 19px;
      margin-bottom: 7px;
    }
    h2 {
      font-size: 17px;
      margin-bottom: 10px;
    }
  }
  section {
    display: flex;
    box-sizing: border-box;
    width: 500px;
    height: fit-content;
    border: 1px solid #4d4d4d;
    border-radius: 11px;
    img {
      width: 180px;
      height: 100%;
      border-radius: 0px 11px 11px 0px;
    }
    h3 {
      font-size: 16px;
      margin-bottom: 5px;
    }
    h4 {
      font-size: 11px;
      margin-bottom: 10px;
    }
    > div:first-child {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 20px;
    }
    > div:last-child {
      width: fit-content;
    }
  }
`;

const ContainerLike = styled.div`
  color: ${(props) => (props.clicked ? "" : "red")};
  cursor: pointer;
`;

const ContainerNumberLikes = styled.div`
  position: relative;
  font-size: 11px;
  > div {
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    background-color: #fff;
    border: 1px solid #ccc;
    padding: 10px;
    font-size: 14px;
    line-height: 1.5;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
    z-index: 1;
  }
`;

const ContainerComments = styled.div`
  display: flex;
  background-color: #1e1e1e;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: fit-content;
  padding-top: 10px;
  hr {
    width: 95%;
    height: 0;
    border-top: 1px solid #353535;
  }
`;
