import styled from "styled-components";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import PostUser from "../components/PostUser.js";
import Loading from "../components/Loading";
import NavBar from "../components/NavBar";
import Post from "../components/Post";
import AddPost from "../components/AddPost";
import FollowBtn from "../components/FollowBtn";


export default function UserTimeLine() {
  const { infosUser } = useContext(AuthContext);
  const { infoUsername, setInfoUsername } = useContext(AuthContext)

  const [postUser, setPostUser] = useState([]);
  const [loading, setLoading] = useState(false);
  const [disable, setDisable] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [following, setFollowing] = useState(false)

  const { REACT_APP_API_URL } = process.env;

  const userId = useParams().id;

  const navigate = useNavigate();

  // useEffect(() => {
  //   if (!infosUser) {
  //     return navigate("/");
  //   }
  //   const res = axios.get(`${REACT_APP_API_URL}/posts/${userId}`, {
  //     headers: { Authorization: `Bearer ${infosUser.token}` },
  //   });
  //   res.then((res) => {
  //     console.log(res.data)
  //     setPostUser(res.data);
  //     setInfoUsername(res.data[0].username)
  //     console.log(res.data[0].username, "res")

  //     setLoading(true);

  //   });
  //   res.catch(() => {
  //     alert(
  //       "An error occured while trying to fetch the posts, please refresh the page"
  //     );
  //     setLoading(true);
  //   });
  // }, [REACT_APP_API_URL, infosUser, navigate]);

  useEffect(() => {
    if (!infosUser) {
      return navigate("/");
    }

    const promise = axios.get(`${REACT_APP_API_URL}/followers/${localStorage.getItem("userId")}/${userId}`)
    promise.then((res) => {
      if (res.data) setFollowing(true)
    })
    promise.catch((err) => {
      console.log(err.response.message)
    })

    const res = axios.get(`${REACT_APP_API_URL}/posts/${userId}`, {
      headers: { Authorization: `Bearer ${infosUser.token}` },
    });
    res.then((res) => {

      const filtered = res.data.filter(p => p.userId == userId);

      if(filtered.length==0){
        setPostUser("")
        const res = axios.get(`${REACT_APP_API_URL}/search/${userId}`, {
          headers: { Authorization: `Bearer ${infosUser.token}` },
        });
        res.then((res)=> {
          console.log(res,"data")
          setInfoUsername(res.data[0].username)

        })
      }
      else{
        setPostUser(filtered);
        setInfoUsername(filtered[0].username)
      }

      console.log(filtered)
      setLoading(true);
    });
    res.catch(() => {
      alert("An error occured while trying to fetch the posts, please refresh the page");
      setLoading(true);
    });

  }, [REACT_APP_API_URL, infosUser, navigate, formSubmitted, refresh]);

  if (!infosUser) {
    return navigate("/");
  }
  if (!loading) {
    return <Loading />;
  }

  function handleFollow() {
    setDisable(true)

    if (following) {
      const promise = axios.delete(`${REACT_APP_API_URL}/followers/${localStorage.getItem("userId")}/${userId}`)
      promise.then((res) => {
        setFollowing(false)
        setDisable(false)
      })
      promise.catch((err) => {
        console.log(err.response.message)
        setDisable(false)
      })
    }
    else {
      const promise = axios.post(`${REACT_APP_API_URL}/followers`, {
        followerId: localStorage.getItem("userId"),
        followedId: userId
      })
      promise.then((res) => {
        setFollowing(true)
        setDisable(false)
      })
      promise.catch((err) => {
        console.log(err.response.message)
        setDisable(false)
      })
    }
  }

  return (
    <Container>
      <NavBar />
      <ContainerAddPost>
        <div>
          <h1>{infoUsername}'s posts</h1>
          {(localStorage.getItem("userId") !== userId) &&
            <FollowBtn disabled={disable} clickFunction={handleFollow} following={following} />
          }
        </div>
        {(localStorage.getItem("userId") == userId) &&
          <AddPost pictureUrl={localStorage.getItem("userImgUrl")} setFormSubmitted={setFormSubmitted} />
        }
      </ContainerAddPost>
      {postUser.length !== 0 ? (
        <ContainerPosts>
          {postUser.map((p) => (
            <Post
              refresh={refresh}
              setRefresh={setRefresh}
              key={p.id}
              body={p}
              liked={p.likesUserId.includes(parseInt(infosUser.userId))}
            />
          ))}
        </ContainerPosts>
      ) : (
        <div>There are no posts yet</div>
      )}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  height: 100vh;
  width: 600px;
  flex-direction: column;
  background-color: #333333;
`;

const ContainerAddPost = styled.div`
  display: flex;
  flex-direction: column;
  height: fit-content;
  align-items: center;
  
  margin-top: 130px;
  margin-bottom: 30px;

  >:first-child{
    display: flex;
    width: 100%;

    align-items: center;
    justify-content: space-between;

    margin-bottom: 40px;
    h1 {
      color: #ffffff;
    }

  }
  div {
    width: 100%;
  }
`;

const ContainerPosts = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: fit-content;
`;
