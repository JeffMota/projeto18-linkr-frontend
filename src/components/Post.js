import React, { useContext, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import {
  AiFillDelete,
  AiOutlineHeart,
  AiFillEdit,
  AiOutlineComment,
  AiFillHeart,
} from "react-icons/ai";
import { ReactTagify } from "react-tagify";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading";
import Comment from "../components/Comment";
import { useEffect } from "react";
import AddComment from "./AddComment";

export default function Post({ body, liked }) {
  const [clickLike, setClickLike] = useState(!liked);
  const [clickComment, setClickComment] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [textHovered, setTextHovered] = useState([]);
  const [numLikes, setNumLikes] = useState(0);
  const [loading, setLoading] = useState(false);
  const [numComments, setNumComments] = useState(0);
  const { REACT_APP_API_URL } = process.env;
  const [formSubmitted, setFormSubmitted] = useState(false);
  const navigate = useNavigate();
  const { infosUser } = useContext(AuthContext);
  const [comment, setComments] = useState([0]);
  useEffect(() => {
    setComments(body.comments);
    if (body.likesUsernames.length === 1 || body.likesUsernames.length === 0) {
      setTextHovered(body.likesUsernames);
    } else if (body.likesUsernames.length === 2) {
      setTextHovered(`${body.likesUsernames[0]} and ${body.likesUsernames[1]}`);
    } else if (body.likesUsernames.length === 3) {
      setTextHovered(
        `${body.likesUsernames[0]}, ${body.likesUsernames[1]} and ${body.likesUsernames[2]}`
      );
    } else {
      setTextHovered(
        `${body.likesUsernames[0]}, ${body.likesUsernames[1]} and other ${
          body.likesUsernames.length - 2
        } people`
      );
    }
    setNumLikes(body.likesUsernames.length);
    setNumComments(body.comments ? body.comments.length : 0);
    setLoading(true);
  }, [
    setComments,
    setTextHovered,
    setNumLikes,
    body.comments,
    body.likesUsernames,
    body.likes,
    setNumComments,
    body.countComments,
    formSubmitted,
  ]);

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

  if (!loading) {
    return <Loading />;
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
          <ContainerNumber
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}>
            <h4 data-test="counter">{numLikes} likes</h4>
            {numLikes > 0 && isHovered && <div>{textHovered}</div>}
          </ContainerNumber>
          <ContainerComment
            onClick={() => setClickComment((current) => !current)}>
            <AiOutlineComment />
          </ContainerComment>
          <ContainerNumber>
            <h4>{numComments} comments</h4>
          </ContainerNumber>
        </div>
        <div>
          <div>
            <h1 data-test="username" onClick={() => navigate(`/user/${body.userId}`)}>
              {body.username}
            </h1>
            {body.userId === Number(localStorage.getItem("userId")) && (
              <div>
                <AiFillEdit data-test="edit-btn" onClick={() => updatePost(body.id)} />
                <AiFillDelete data-test="delete-btn" onClick={() => deletePost(body.id)} />
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
            data-test="link"
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
      {clickComment && (
        <ContainerComments>
          {comment && comment.map((p) => <Comment key={p.id} body={p} />)}
          <AddComment
            pictureUrl={localStorage.getItem("userImgUrl")}
            setFormSubmitted={setFormSubmitted}
            postId={body.id}
          />
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
  position: relative;
  z-index: 2;
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
      margin: 0 5px 15px 5px;
      object-fit: cover;
    }
  }
  > div:last-child {
    margin: 0 10px;
    width: calc(100% - 70px);
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
  @media only screen and (max-width: 600px) {
    width: 100%;
    border-radius: 0;
    section {
      width: 100%;
      img {
        width: 100%;
        height: 100%;
        border-radius: 0px 11px 11px 0px;
      }
    }
  }
`;

const ContainerLike = styled.div`
  color: ${(props) => (props.clicked ? "" : "red")};
  cursor: pointer;
`;

const ContainerComment = styled.div`
  cursor: pointer;
`;

const ContainerNumber = styled.div`
  position: relative;
  font-size: 11px;
  margin-bottom: 15px;
  > div {
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    background-color: #fff;
    border: 1px solid #ccc;
    margin-top: 10px;
    padding: 5px 10px;
    font-size: 14px;
    line-height: 1.5;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
    z-index: 1;
    min-width: max-content;
    &:before {
      content: "";
      position: absolute;
      border-style: solid;
      border-width: 0 10px 10px 10px;
      border-color: transparent transparent #fff transparent;
      top: -10px;
      left: 50%;
      transform: translateX(-50%);
    }
  }
`;

const ContainerComments = styled.div`
  display: flex;
  position: relative;
  z-index: 1;
  background-color: #1e1e1e;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: fit-content;
  padding-top: 20px;
  border-radius: 16px;
  margin-top: -25px;
`;
