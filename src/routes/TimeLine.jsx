import styled from "styled-components";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { SocketContext } from "../contexts/SocketContext";
import { useNavigate } from "react-router-dom";
import Post from "../components/Post";
import Loading from "../components/Loading";
import NavBar from "../components/NavBar";
import AddPost from "../components/AddPost";
import { socket } from "../services/socket";

export default function TimeLine() {
  const { infosUser } = useContext(AuthContext);
  const { socketChannel, setSocketChannel } = useContext(SocketContext);
  const [post, setPost] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const navigate = useNavigate();
  const { REACT_APP_API_URL } = process.env;
  socket.on("update", (data) => {
    setSocketChannel(true);
  });
  useEffect(() => {
    if (!infosUser) {
      return navigate("/");
    }
    setSocketChannel(false);
    const res = axios.get(`${REACT_APP_API_URL}/posts`, {
      headers: { Authorization: `Bearer ${infosUser.token}` },
    });
    res.then((res) => {
      console.log(res.status);
      setPost(res.data);
      setLoading(true);
    });
    res.catch(() => {
      alert(
        "An error occured while trying to fetch the posts, please refresh the page"
      );
      setLoading(true);
    });
  }, [
    REACT_APP_API_URL,
    infosUser,
    navigate,
    formSubmitted,
    setSocketChannel,
    socketChannel,
  ]);
  if (!loading) {
    return <Loading />;
  }
  return (
    <Container>
      <NavBar />
      <h1>timeline</h1>
      <ContainerAddPost>
        <AddPost
          pictureUrl={localStorage.getItem("userImgUrl")}
          setFormSubmitted={setFormSubmitted}
        />
      </ContainerAddPost>
      {post.length !== 0 ? (
        <ContainerPosts>
          {post.map((p) => (
            <Post
              key={p.id}
              body={p}
              liked={p.likesUserId.includes(parseInt(infosUser.userId))}
            />
          ))}
        </ContainerPosts>
      ) : (
        <div data-test="message">There are no posts yet</div>
      )}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 600px;
  background-color: #333333;
  > h1 {
    display: block;
    justify-content: left;
    width: 600px;
    margin-top: 130px;
    color: #ffffff;
    margin-bottom: 40px;
  }
`;

const ContainerAddPost = styled.div`
  display: flex;
  flex-direction: column;
  height: fit-content;
  align-items: center;
  margin-top: 50px;
  margin-bottom: 30px;
  width: 600px;
`;

const ContainerPosts = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: fit-content;
`;
